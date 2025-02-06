import { CastableBase, ReadonlyArray, ReadonlyPath, append, conflatenateAll, defineProperties, stringifyPath } from "@ark/util";
import { arkKind } from "./utils.js";
export class ArkError extends CastableBase {
    [arkKind] = "error";
    path;
    data;
    nodeConfig;
    input;
    ctx;
    // TS gets confused by <code>, so internally we just use the base type for input
    constructor(input, ctx) {
        super();
        this.input = input;
        this.ctx = ctx;
        defineProperties(this, input);
        const data = ctx.data;
        if (input.code === "union") {
            input.errors = input.errors.flatMap(innerError => {
                // flatten union errors to avoid repeating context like "foo must be foo must be"...
                const flat = innerError.hasCode("union") ? innerError.errors : [innerError];
                if (!input.prefixPath && !input.relativePath)
                    return flat;
                return flat.map(e => e.transform(e => ({
                    ...e,
                    path: conflatenateAll(input.prefixPath, e.path, input.relativePath)
                })));
            });
        }
        this.nodeConfig = ctx.config[this.code];
        const basePath = [...(input.path ?? ctx.path)];
        if (input.relativePath)
            basePath.push(...input.relativePath);
        if (input.prefixPath)
            basePath.unshift(...input.prefixPath);
        this.path = new ReadonlyPath(...basePath);
        this.data = "data" in input ? input.data : data;
    }
    transform(f) {
        const normalizedInput = {
            ...this.input,
            data: this.data,
            // ensure we don't continue adding relative path segments
            path: this.path,
            relativePath: [],
            prefixPath: []
        };
        return new ArkError(f(normalizedInput), this.ctx);
    }
    hasCode(code) {
        return this.code === code;
    }
    get propString() {
        return stringifyPath(this.path);
    }
    get expected() {
        return (this.input.expected ??
            this.meta?.expected?.(this.input) ??
            this.nodeConfig.expected?.(this.input));
    }
    get actual() {
        return (this.input.actual ??
            this.meta?.actual?.(this.data) ??
            this.nodeConfig.actual?.(this.data));
    }
    get problem() {
        return (this.input.problem ??
            this.meta?.problem?.(this) ??
            this.nodeConfig.problem(this));
    }
    get message() {
        return (this.input.message ??
            this.meta?.message?.(this) ??
            this.nodeConfig.message(this));
    }
    toString() {
        return this.message;
    }
    throw() {
        throw this;
    }
}
/**
 * A ReadonlyArray of `ArkError`s returned by a Type on invalid input.
 *
 * Subsequent errors added at an existing path are merged into an
 * ArkError intersection.
 */
export class ArkErrors extends ReadonlyArray {
    ctx;
    constructor(ctx) {
        super();
        this.ctx = ctx;
    }
    /**
     * Errors by a pathString representing their location.
     */
    byPath = Object.create(null);
    /**
     * All pathStrings at which errors are present mapped to the errors occuring
     * at that path or any nested path within it.
     */
    byAncestorPath = Object.create(null);
    count = 0;
    mutable = this;
    /**
     * Throw an AggregateError based on these errors.
     */
    throw() {
        throw new AggregateError(this, this.summary);
    }
    /**
     * Append an ArkError to this array, ignoring duplicates.
     */
    add(error) {
        if (this.includes(error))
            return;
        this._add(error);
    }
    transform(f) {
        const result = new ArkErrors(this.ctx);
        this.forEach(e => result.add(f(e)));
        return result;
    }
    /**
     * Add all errors from an ArkErrors instance, ignoring duplicates and
     * prefixing their paths with that of the current Traversal.
     */
    merge(errors) {
        errors.forEach(e => {
            if (this.includes(e))
                return;
            this._add(new ArkError({ ...e, path: [...this.ctx.path, ...e.path] }, this.ctx));
        });
    }
    /**
     * @internal
     */
    affectsPath(path) {
        if (this.length === 0)
            return false;
        return (
        // this would occur if there is an existing error at a prefix of path
        // e.g. the path is ["foo", "bar"] and there is an error at ["foo"]
        path.stringifyAncestors().some(s => s in this.byPath) ||
            // this would occur if there is an existing error at a suffix of path
            // e.g. the path is ["foo"] and there is an error at ["foo", "bar"]
            path.stringify() in this.byAncestorPath);
    }
    /**
     * A human-readable summary of all errors.
     */
    get summary() {
        return this.toString();
    }
    /**
     * Alias of `summary` for StandardSchema compatibility.
     */
    get message() {
        return this.toString();
    }
    /**
     * Alias of this ArkErrors instance for StandardSchema compatibility.
     */
    get issues() {
        return this;
    }
    toString() {
        return this.join("\n");
    }
    _add(error) {
        const existing = this.byPath[error.propString];
        if (existing) {
            const errorIntersection = new ArkError({
                code: "intersection",
                errors: existing.hasCode("intersection") ?
                    [...existing.errors, error]
                    : [existing, error]
            }, this.ctx);
            const existingIndex = this.indexOf(existing);
            this.mutable[existingIndex === -1 ? this.length : existingIndex] =
                errorIntersection;
            this.byPath[error.propString] = errorIntersection;
            // add the original error here rather than the intersection
            // since the intersection is reflected by the array of errors at
            // this path
            this.addAncestorPaths(error);
        }
        else {
            this.byPath[error.propString] = error;
            this.addAncestorPaths(error);
            this.mutable.push(error);
        }
        this.count++;
    }
    addAncestorPaths(error) {
        error.path.stringifyAncestors().forEach(propString => {
            this.byAncestorPath[propString] = append(this.byAncestorPath[propString], error);
        });
    }
}

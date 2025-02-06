import { $ark, BaseScope, hasArkKind, parseGeneric } from "@ark/schema";
import { flatMorph, isArray, isThunk, throwParseError } from "@ark/util";
import { parseGenericParamName } from "./generic.js";
import { InternalMatchParser } from "./match.js";
import { shallowDefaultableMessage, shallowOptionalMessage } from "./parser/ast/validate.js";
import { parseInnerDefinition } from "./parser/definition.js";
import { ArkTypeScanner } from "./parser/shift/scanner.js";
import { InternalTypeParser } from "./type.js";
export const $arkTypeRegistry = $ark;
export class InternalScope extends BaseScope {
    get ambientAttachments() {
        if (!$arkTypeRegistry.typeAttachments)
            return;
        return this.cacheGetter("ambientAttachments", flatMorph($arkTypeRegistry.typeAttachments, (k, v) => [
            k,
            this.bindReference(v)
        ]));
    }
    preparseOwnAliasEntry(k, v) {
        const firstParamIndex = k.indexOf("<");
        if (firstParamIndex === -1)
            return [k, v];
        if (k.at(-1) !== ">") {
            throwParseError(`'>' must be the last character of a generic declaration in a scope`);
        }
        const name = k.slice(0, firstParamIndex);
        const paramString = k.slice(firstParamIndex + 1, -1);
        return [
            name,
            // use a thunk definition for the generic so that we can parse
            // constraints within the current scope
            () => {
                const params = this.parseGenericParams(paramString, { alias: name });
                const generic = parseGeneric(params, v, this);
                return generic;
            }
        ];
    }
    parseGenericParams(def, opts) {
        return parseGenericParamName(new ArkTypeScanner(def), [], this.createParseContext({
            ...opts,
            def,
            prefix: "generic"
        }));
    }
    normalizeRootScopeValue(resolution) {
        if (isThunk(resolution) && !hasArkKind(resolution, "generic"))
            return resolution();
        return resolution;
    }
    preparseOwnDefinitionFormat(def, opts) {
        return {
            ...opts,
            def,
            prefix: opts.alias ?? "type"
        };
    }
    parseOwnDefinitionFormat(def, ctx) {
        const isScopeAlias = ctx.alias && ctx.alias in this.aliases;
        // if the definition being parsed is not a scope alias and is not a
        // generic instantiation (i.e. opts don't include args), add `this` as a resolution.
        // if we're parsing a nested string, ctx.args will have already been set
        if (!isScopeAlias && !ctx.args)
            ctx.args = { this: ctx.id };
        const result = parseInnerDefinition(def, ctx);
        if (isArray(result)) {
            if (result[1] === "=")
                return throwParseError(shallowDefaultableMessage);
            if (result[1] === "?")
                return throwParseError(shallowOptionalMessage);
        }
        return result;
    }
    unit = value => this.units([value]);
    enumerated = (...values) => this.units(values);
    instanceOf = ctor => this.node("proto", { proto: ctor }, { prereduced: true });
    type = new InternalTypeParser(this);
    match = new InternalMatchParser(this);
    declare = () => ({
        type: this.type
    });
    define(def) {
        return def;
    }
    static scope = ((def, config = {}) => new InternalScope(def, config));
    static module = ((def, config = {}) => this.scope(def, config).export());
}
export const scope = Object.assign(InternalScope.scope, {
    define: def => def
});
export const Scope = InternalScope;

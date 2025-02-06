import { ArkErrors, BaseRoot, type BaseParseOptions, type MetaSchema, type Morph, type Predicate, type RootSchema } from "@ark/schema";
import { Callable, Hkt, type Constructor, type array, type conform } from "@ark/util";
import type { distill } from "./attributes.ts";
import type { Generic, GenericParser, ParameterString, baseGenericConstraints, parseValidGenericParams, validateParameterString } from "./generic.ts";
import type { Ark, keywords, type } from "./keywords/keywords.ts";
import type { BaseType } from "./methods/base.ts";
import type { instantiateType } from "./methods/instantiate.ts";
import type { validateDeclared } from "./parser/definition.ts";
import type { ArgTwoOperator, IndexZeroOperator, TupleInfixOperator } from "./parser/tupleExpressions.ts";
import type { InternalScope, ModuleParser, Scope, ScopeParser, bindThis } from "./scope.ts";
/** The convenience properties attached to `type` */
export type TypeParserAttachments = Omit<TypeParser, never>;
export interface TypeParser<$ = {}> extends Ark.boundTypeAttachments<$> {
    /**
     * Create a {@link Type} from your definition.
     *
     * @example const person = type({ name: "string" })
     */
    <const def, r = Type<type.infer<def, $>, $>>(def: type.validate<def, $>): r;
    /**
     * Create a {@link Generic} from a parameter string and body definition.
     *
     * @param params A string like "<t, n extends number>" specifying the
     * {@link Generic}'s parameters and any associated constraints via `extends`.
     *
     * @param def The definition for the body of the {@link Generic}. Can reference the
     * parameter names specified in the previous argument in addition to aliases
     * from its {@link Scope}.
     *
     * @example const boxOf = type("<t extends string | number>", { contents: "t" })
     */
    <const params extends ParameterString, const def>(params: validateParameterString<params, $>, def: type.validate<def, $, baseGenericConstraints<parseValidGenericParams<params, $>>>): Generic<parseValidGenericParams<params, $>, def, $>;
    /**
     * Create a {@link Type} from a [tuple expression](http://localhost:3000/docs/expressions)
     * spread as this function's arguments.
     *
     * @example type("string", "|", { foo: "number" })
     */
    <const zero, const one, const rest extends array, r = Type<type.infer<[zero, one, ...rest], $>, $>>(_0: zero extends IndexZeroOperator ? zero : type.validate<zero, $>, _1: zero extends "keyof" ? type.validate<one, $> : zero extends "instanceof" ? conform<one, Constructor> : zero extends "===" ? conform<one, unknown> : conform<one, ArgTwoOperator>, ..._2: zero extends "===" ? rest : zero extends "instanceof" ? conform<rest, readonly Constructor[]> : one extends TupleInfixOperator ? one extends ":" ? [Predicate<distill.In<type.infer<zero, $>>>] : one extends "=>" ? [Morph<distill.Out<type.infer<zero, $>>, unknown>] : one extends "@" ? [MetaSchema] : [type.validate<rest[0], $>] : []): r;
    /**
     * An alias of the {@link ArkErrors} class, an instance of which is returned when a {@link Type}
     * is invoked with invalid input.
     *
     * @example
     * const out = myType(data)
     *
     * if(out instanceof type.errors) console.log(out.summary)
     *
     */
    errors: typeof ArkErrors;
    hkt: typeof Hkt;
    keywords: typeof keywords;
    /**
     * The {@link Scope} in which definitions passed to this function will be parsed.
     */
    $: Scope<$>;
    /**
     * An alias of `type` with no type-level validation or inference.
     *
     * Useful when wrapping `type` or using it to parse a dynamic definition.
     */
    raw(def: unknown): BaseType<any, $>;
    module: ModuleParser;
    scope: ScopeParser;
    define: DefinitionParser<$>;
    generic: GenericParser<$>;
    schema: SchemaParser<$>;
    /**
     * Create a {@link Type} that is satisfied only by a value strictly equal (`===`) to the argument passed to this function.
     * @example const foo = type.unit('foo') // {@link Type}<'foo'>
     * @example const sym: unique symbol = Symbol(); type.unit(sym) // {@link Type}<typeof sym>
     */
    unit: UnitTypeParser<$>;
    /**
     * Create a {@link Type} that is satisfied only by a value strictly equal (`===`) to one of the arguments passed to this function.
     * @example const enum = type.enumerated('foo', 'bar', obj) // obj is a by-reference object
     * @example const tupleForm = type(['===', 'foo', 'bar', obj])
     * @example const argsForm = type('===', 'foo', 'bar', obj)
     */
    enumerated: EnumeratedTypeParser<$>;
    /**
     * Create a {@link Type} that is satisfied only by a value of a specific class.
     * @example const array = type.instanceOf(Array)
     */
    instanceOf: InstanceOfTypeParser<$>;
}
export declare class InternalTypeParser extends Callable<(...args: unknown[]) => BaseRoot | Generic, TypeParserAttachments> {
    constructor($: InternalScope);
}
export type DeclarationParser<$> = <preinferred>() => {
    type: <const def>(def: validateDeclared<preinferred, def, $, bindThis<def>>) => Type<preinferred, $>;
};
export type UnitTypeParser<$> = <const t>(value: t) => Type<t, $>;
export type InstanceOfTypeParser<$> = <const t extends object>(ctor: Constructor<t>) => Type<t, $>;
export type EnumeratedTypeParser<$> = <const values extends readonly unknown[]>(...values: values) => Type<values[number], $>;
export type DefinitionParser<$> = <const def>(def: type.validate<def, $>) => def;
export type SchemaParser<$> = (schema: RootSchema, opts?: BaseParseOptions) => Type<unknown, $>;
export type Type<t = unknown, $ = {}> = instantiateType<t, $>;
export type TypeConstructor<t = unknown, $ = {}> = new (def: unknown, $: Scope<$>) => Type<t, $>;
export declare const Type: TypeConstructor;

import { type BaseParseContext, type BaseRoot, type MetaSchema, type Morph, type Predicate, type unwrapDefault } from "@ark/schema";
import { type array, type BuiltinObjectKind, type Constructor, type Domain, type show } from "@ark/util";
import type { defaultFor, distill, inferIntersection, inferMorphOut, inferPredicate, Out, withDefault } from "../attributes.ts";
import type { type } from "../keywords/keywords.ts";
import type { inferDefinition, validateDefinition } from "./definition.ts";
import { writeMissingRightOperandMessage } from "./shift/operand/unenclosed.ts";
import type { ArkTypeScanner } from "./shift/scanner.ts";
import type { BaseCompletions } from "./string.ts";
export declare const maybeParseTupleExpression: (def: array, ctx: BaseParseContext) => BaseRoot | null;
export type maybeValidateTupleExpression<def extends array, $, args> = def extends IndexZeroExpression ? validatePrefixExpression<def, $, args> : def extends IndexOneExpression ? validateIndexOneExpression<def, $, args> : def extends (readonly ["", ...unknown[]] | readonly [unknown, "", ...unknown[]]) ? readonly [
    def[0] extends "" ? BaseCompletions<$, args, IndexZeroOperator | "..."> : def[0],
    def[1] extends "" ? BaseCompletions<$, args, IndexOneOperator | "..."> : def[1]
] : null;
export type inferTupleExpression<def extends TupleExpression, $, args> = def[1] extends "[]" ? inferDefinition<def[0], $, args>[] : def[1] extends "?" ? inferDefinition<def[0], $, args> : def[1] extends "&" ? inferIntersection<inferDefinition<def[0], $, args>, inferDefinition<def[2], $, args>> : def[1] extends "|" ? inferDefinition<def[0], $, args> | inferDefinition<def[2], $, args> : def[1] extends ":" ? inferPredicate<inferDefinition<def[0], $, args>, def[2]> : def[1] extends "=>" ? parseMorph<def[0], def[2], $, args> : def[1] extends "=" ? withDefault<inferDefinition<def[0], $, args>, unwrapDefault<def[2]>> : def[1] extends "@" ? inferDefinition<def[0], $, args> : def extends readonly ["===", ...infer values] ? values[number] : def extends (readonly ["instanceof", ...infer constructors extends Constructor[]]) ? InstanceType<constructors[number]> : def[0] extends "keyof" ? inferKeyOfExpression<def[1], $, args> : never;
export type validatePrefixExpression<def extends IndexZeroExpression, $, args> = def["length"] extends 1 ? readonly [writeMissingRightOperandMessage<def[0]>] : def[0] extends "keyof" ? readonly [def[0], validateDefinition<def[1], $, args>] : def[0] extends "===" ? readonly [def[0], ...unknown[]] : def[0] extends "instanceof" ? readonly [def[0], ...Constructor[]] : never;
export type validateIndexOneExpression<def extends IndexOneExpression, $, args> = def[1] extends TuplePostfixOperator ? readonly [validateDefinition<def[0], $, args>, def[1]] : readonly [
    validateDefinition<def[0], $, args>,
    def["length"] extends 2 ? writeMissingRightOperandMessage<def[1]> : def[1],
    def[1] extends "|" ? validateDefinition<def[2], $, args> : def[1] extends "&" ? validateDefinition<def[2], $, args> : def[1] extends ":" ? Predicate<type.infer.Out<def[0], $, args>> : def[1] extends "=>" ? Morph<type.infer.Out<def[0], $, args>> : def[1] extends "=" ? defaultFor<type.infer.In<def[0], $, args>> : def[1] extends "@" ? MetaSchema : validateDefinition<def[2], $, args>
];
export type UnparsedTupleExpressionInput = {
    instanceof: Constructor;
    "===": unknown;
};
export type UnparsedTupleOperator = show<keyof UnparsedTupleExpressionInput>;
export declare const parseKeyOfTuple: PrefixParser<"keyof">;
export type inferKeyOfExpression<operandDef, $, args> = show<keyof inferDefinition<operandDef, $, args>>;
export type IndexOneParser<token extends IndexOneOperator> = (def: IndexOneExpression<token>, ctx: BaseParseContext) => BaseRoot;
export type PrefixParser<token extends IndexZeroOperator> = (def: IndexZeroExpression<token>, ctx: BaseParseContext) => BaseRoot;
export type TupleExpression = IndexZeroExpression | IndexOneExpression;
export type TupleExpressionOperator = IndexZeroOperator | IndexOneOperator;
export type IndexOneOperator = TuplePostfixOperator | TupleInfixOperator;
export type ArgTwoOperator = Exclude<IndexOneOperator, "?" | "=">;
export type TuplePostfixOperator = "[]" | "?";
export type TupleInfixOperator = "&" | "|" | "=>" | "=" | ":" | "@";
export type IndexOneExpression<token extends IndexOneOperator = IndexOneOperator> = readonly [unknown, token, ...unknown[]];
export declare const parseMorphTuple: IndexOneParser<"=>">;
export declare const writeMalformedFunctionalExpressionMessage: (operator: ":" | "=>", value: unknown) => string;
export type parseMorph<inDef, morph, $, args> = morph extends Morph ? inferMorphOut<morph> extends infer out ? (In: distill.In<inferDefinition<inDef, $, args>>) => Out<out> : never : never;
export declare const parseNarrowTuple: IndexOneParser<":">;
export type IndexZeroOperator = "keyof" | "instanceof" | "===";
export type IndexZeroExpression<token extends IndexZeroOperator = IndexZeroOperator> = readonly [token, ...unknown[]];
export type InfixExpression = readonly [
    unknown,
    ArkTypeScanner.InfixToken,
    ...unknown[]
];
export declare const writeInvalidConstructorMessage: <actual extends Domain | BuiltinObjectKind>(actual: actual) => string;

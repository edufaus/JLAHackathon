import { type BaseRoot } from "@ark/schema";
import { Callable, type array, type Fn, type isDisjoint, type numericStringKeyOf, type propValueOf, type unionToTuple } from "@ark/util";
import type { distill, inferIntersection } from "./attributes.ts";
import type { type } from "./keywords/keywords.ts";
import type { InternalScope } from "./scope.ts";
type Thens = array<(In: any) => unknown>;
type MatchParserContext = {
    thens: Thens;
    $: unknown;
    input: unknown;
};
export type MatchParser<$> = CaseMatchParser<{
    thens: [];
    $: $;
    input: unknown;
}> & {
    (): ChainableMatchParser<{
        thens: [];
        $: $;
        input: unknown;
    }>;
    from<typedInput>(): ChainableMatchParser<{
        thens: [];
        $: $;
        input: typedInput;
    }>;
};
type addBranches<ctx extends MatchParserContext, branches extends readonly unknown[]> = branches extends Thens ? {
    $: ctx["$"];
    input: ctx["input"];
    thens: [...ctx["thens"], ...branches];
} : never;
type inferMatchBranch<def, ctx extends MatchParserContext> = distill.Out<inferIntersection<ctx["input"], type.infer<def, ctx["$"]>>>;
type ChainableMatchParser<ctx extends MatchParserContext> = {
    when: <def, ret>(when: type.validate<def, ctx["$"]>, then: (In: inferMatchBranch<def, ctx>) => ret) => ChainableMatchParser<addBranches<ctx, [(In: inferMatchBranch<def, ctx>) => ret]>>;
    cases: CaseMatchParser<ctx>;
    orThrow: () => finalizeMatchParser<addBranches<ctx, [(In: ctx["input"]) => never]>>;
    default: MatchParserDefaultInvocation<ctx>;
};
type MatchParserDefaultInvocation<ctx extends MatchParserContext> = {
    <f extends (In: ctx["input"]) => unknown>(f: f): finalizeWithDefault<ctx, ReturnType<f>>;
    <const value>(value: value): finalizeWithDefault<ctx, value>;
};
type validateCases<cases, ctx extends MatchParserContext> = {
    [def in keyof cases | keyof ctx["$"] | "default"]?: def extends "default" ? (In: ctx["input"]) => unknown : def extends type.validate<def, ctx["$"]> ? (In: inferMatchBranch<def, ctx>) => unknown : type.validate<def, ctx["$"]>;
};
type errorCases<cases, ctx extends MatchParserContext> = {
    [def in keyof cases]?: def extends "default" ? (In: ctx["input"]) => unknown : def extends type.validate<def, ctx["$"]> ? (In: inferMatchBranch<def, ctx>) => unknown : type.validate<def, ctx["$"]>;
} & {
    [k in Exclude<keyof ctx["$"], keyof cases>]?: (In: distill.Out<inferIntersection<ctx["input"], ctx["$"][k]>>) => unknown;
} & {
    default?: (In: ctx["input"]) => unknown;
};
export type CaseMatchParser<ctx extends MatchParserContext> = <cases>(def: cases extends validateCases<cases, ctx> ? cases : errorCases<cases, ctx>) => cases extends {
    default: (...args: never[]) => infer defaultReturn;
} ? finalizeWithDefault<addBranches<ctx, unionToTuple<cases[Exclude<keyof cases, "default">]>>, defaultReturn> : ChainableMatchParser<addBranches<ctx, unionToTuple<propValueOf<cases>>>>;
type finalizeWithDefault<ctx extends MatchParserContext, defaultReturn> = finalizeMatchParser<addBranches<ctx, [(_: ctx["input"]) => defaultReturn]>>;
type finalizeMatchParser<ctx extends MatchParserContext> = MatchInvocation<{
    thens: ctx["thens"];
    input: ctx["input"];
}>;
type MatchInvocationContext = {
    thens: readonly Fn[];
    input: unknown;
};
export type MatchInvocation<ctx extends MatchInvocationContext> = <const data extends ctx["input"]>(data: data) => {
    [i in numericStringKeyOf<ctx["thens"]>]: isDisjoint<data, Parameters<ctx["thens"][i]>[0]> extends true ? never : ReturnType<ctx["thens"][i]>;
}[numericStringKeyOf<ctx["thens"]>];
export declare class InternalMatchParser extends Callable<(...args: unknown[]) => BaseRoot> {
    constructor($: InternalScope);
}
export {};

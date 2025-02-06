import type { ArkRegistry, requireKeys, show } from "@ark/util";
import type { intrinsic } from "./intrinsic.ts";
import type { nodesByRegisteredId } from "./parse.ts";
import type { ActualWriter, ArkErrorCode, ExpectedWriter, MessageWriter, ProblemWriter } from "./shared/errors.ts";
import { type DescriptionWriter, type NodeKind } from "./shared/implement.ts";
import type { UndeclaredKeyBehavior } from "./structure/structure.ts";
export interface ArkSchemaRegistry extends ArkRegistry {
    intrinsic: typeof intrinsic;
    config: ArkConfig;
    defaultConfig: ResolvedConfig;
    resolvedConfig: ResolvedConfig;
    nodesByRegisteredId: typeof nodesByRegisteredId;
}
type nodeConfigForKind<kind extends NodeKind> = Readonly<show<{
    description?: DescriptionWriter<kind>;
} & (kind extends ArkErrorCode ? {
    expected?: ExpectedWriter<kind>;
    actual?: ActualWriter<kind>;
    problem?: ProblemWriter<kind>;
    message?: MessageWriter<kind>;
} : {})>>;
type NodeConfigsByKind = {
    [kind in NodeKind]: nodeConfigForKind<kind>;
};
export type NodeConfig<kind extends NodeKind = NodeKind> = NodeConfigsByKind[kind];
export interface UnknownErrorWriters {
    expected?: ExpectedWriter;
    actual?: ActualWriter;
    problem?: ProblemWriter;
    message?: MessageWriter;
}
interface UnknownNodeConfig extends UnknownErrorWriters {
    description?: DescriptionWriter;
}
export type ResolvedUnknownNodeConfig = requireKeys<UnknownNodeConfig, "description">;
export declare const configure: (config: ArkConfig) => ArkConfig;
export declare const mergeConfigs: <base extends ArkConfig>(base: base, extensions: ArkConfig | undefined) => base;
export type CloneImplementation = <original extends object>(original: original) => original;
export interface ArkConfig extends Partial<Readonly<NodeConfigsByKind>> {
    jitless?: boolean;
    clone?: boolean | CloneImplementation;
    onUndeclaredKey?: UndeclaredKeyBehavior;
    numberAllowsNaN?: boolean;
    dateAllowsInvalid?: boolean;
}
export type resolveConfig<config extends ArkConfig> = show<{
    [k in keyof ArkConfig]-?: k extends NodeKind ? Required<config[k]> : k extends "clone" ? CloneImplementation | false : config[k];
} & Omit<config, keyof ArkConfig>>;
export type ResolvedConfig = resolveConfig<ArkConfig>;
export {};

import { $arkTypeRegistry, scope } from "../scope.js";
import { arkBuiltins } from "./builtins.js";
import { arkPrototypes } from "./constructors.js";
import { number } from "./number.js";
import { string } from "./string.js";
import { arkTsGenerics, arkTsKeywords, object, unknown } from "./ts.js";
$arkTypeRegistry.typeAttachments = {
    ...arkTsKeywords,
    arrayIndex: arkPrototypes.Array.index,
    Key: arkBuiltins.Key,
    Record: arkTsGenerics.Record,
    Array: arkPrototypes.Array.root,
    Date: arkPrototypes.Date
};
export const ark = scope({
    ...arkTsKeywords,
    ...arkTsGenerics,
    ...arkPrototypes,
    ...arkBuiltins,
    string,
    number,
    object,
    unknown
}, { prereducedAliases: true, ambient: true });
export const keywords = ark.export();
export const type = ark.type;
// export const match: MatchParser<{}> = ark.match as never
export const generic = ark.generic;
export const schema = ark.schema;
export const define = ark.define;
export const declare = ark.declare;

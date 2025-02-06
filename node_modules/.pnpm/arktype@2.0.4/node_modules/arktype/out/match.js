import { intrinsic } from "@ark/schema";
import { Callable } from "@ark/util";
export class InternalMatchParser extends Callable {
    constructor($) {
        super(() => {
            const matchParser = () => {
                const handledCases = [];
                let defaultCase = null;
                const parser = {
                    when: (when, then) => {
                        handledCases.push({
                            when: $.parse(when),
                            then
                        });
                        return parser;
                    },
                    finalize: () => {
                        const branches = handledCases.flatMap(({ when, then }) => {
                            if (when.kind === "union") {
                                return when.branches.map(branch => ({
                                    in: branch,
                                    morphs: [then]
                                }));
                            }
                            if (when.hasKind("morph"))
                                return [{ in: when, morphs: [...when.morphs, then] }];
                            return [{ in: when, morphs: [then] }];
                        });
                        if (defaultCase)
                            branches.push({ in: intrinsic.unknown, morphs: [defaultCase] });
                        const matchers = $.node("union", {
                            branches,
                            ordered: true
                        });
                        return matchers.assert;
                    },
                    orThrow: () => 
                    // implicitly finalize, we don't need to do anything else because we throw either way
                    parser.finalize(),
                    default: (x) => {
                        if (x instanceof Function)
                            defaultCase = x;
                        else
                            defaultCase = () => x;
                        return parser.finalize();
                    }
                };
                return parser;
            };
            return Object.assign(() => matchParser(), {
                only: () => matchParser()
            });
        }, {
            bind: $
        });
    }
}

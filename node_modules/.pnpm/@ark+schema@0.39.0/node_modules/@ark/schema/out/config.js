import { isNodeKind } from "./shared/implement.js";
import { $ark } from "./shared/registry.js";
// $ark.config could already be set if it were imported previously from the
// dedicated config entrypoint, in which case we don't want to reinitialize it
$ark.config ??= {};
export const configure = (config) => {
    const result = Object.assign($ark.config, mergeConfigs($ark.config, config));
    $ark.resolvedConfig &&= mergeConfigs($ark.resolvedConfig, result);
    return result;
};
export const mergeConfigs = (base, extensions) => {
    if (!extensions)
        return base;
    const result = { ...base };
    let k;
    for (k in extensions) {
        result[k] =
            isNodeKind(k) ?
                {
                    ...base[k],
                    ...extensions[k]
                }
                : extensions[k];
    }
    return result;
};

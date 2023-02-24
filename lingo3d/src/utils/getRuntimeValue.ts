import Appendable from "../api/core/Appendable"
import unsafeGetValue from "./unsafeGetValue"
import unsafeSetValue from "./unsafeSetValue"

export const getRuntimeValue = (target: Appendable, key: string) => {
    if (target.runtimeData && key in target.runtimeData)
        return target.runtimeData[key]
    return unsafeGetValue(target, key)
}

export const setRuntimeValue = (
    target: Appendable,
    key: string,
    value: any
) => {
    if (target.runtimeData && key in target.runtimeData)
        target.runtimeData[key] = value
    else unsafeSetValue(target, key, value)
    return value
}

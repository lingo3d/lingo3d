import { isLazy } from "@lincode/utils"
import Loaded from "../../display/core/Loaded"
import DefaultMethod from "./DefaultMethod"
import Defaults from "./Defaults"
import NullableCallback from "./NullableCallback"
import NullableDefault from "./NullableDefault"

const readLazy = <T>(val: T | (() => T)): T =>
    typeof val === "function" && isLazy(val) ? val() : val

const getDefaultValue = (
    defaults: Defaults<any>,
    key: string,
    fillNullableDefault?: boolean,
    fillFunctionArgs?: boolean,
    isFunctionPtr?: ["method" | "callback" | ""],
    runtimeManager?: Loaded
) => {
    const result = readLazy(defaults[key])
    if (result instanceof NullableDefault)
        return fillNullableDefault ? result.value : undefined
    if (result instanceof NullableCallback) {
        if (isFunctionPtr) isFunctionPtr[0] = "callback"
        return fillFunctionArgs ? result.param : undefined
    }
    if (result instanceof DefaultMethod) {
        if (isFunctionPtr) isFunctionPtr[0] = "method"
        return fillFunctionArgs ? result.arg : undefined
    }
    if (fillNullableDefault) return result ?? ""
    return result
}
export default getDefaultValue

const isEqual = (val0: any, val1: any) =>
    val0 === val1 ||
    (typeof val0 === typeof val1 &&
        JSON.stringify(val0) === JSON.stringify(val1))

export const equalsValue = (
    val0: any,
    val1: any,
    defaults: Defaults<any>,
    key: string
) => {
    const defaultValue = getDefaultValue(defaults, key, true)
    return isEqual(val0 ?? defaultValue, val1 ?? defaultValue)
}

export const equalsDefaultValue = (
    val: any,
    defaults: Defaults<any>,
    key: string
) => {
    const defaultValue = getDefaultValue(defaults, key, true)
    return isEqual(val ?? defaultValue, defaultValue)
}

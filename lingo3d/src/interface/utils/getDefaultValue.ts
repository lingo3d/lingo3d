import { isLazy } from "@lincode/utils"
import { isPoint, PointType } from "../../utils/isPoint"
import DefaultMethod from "./DefaultMethod"
import Defaults from "./Defaults"
import NullableCallback from "./NullableCallback"
import NullableDefault from "./NullableDefault"

const readLazy = <T>(val: T | (() => T)): T =>
    typeof val === "function" && isLazy(val) ? val() : val

export default (
    defaults: Defaults<any>,
    key: string,
    fillNullableDefault?: boolean,
    fillFunctionArgs?: boolean,
    isFunctionPtr?: [boolean]
) => {
    const result = readLazy(defaults[key])
    if (result instanceof NullableDefault)
        return fillNullableDefault ? result.value : undefined
    if (result instanceof NullableCallback) {
        if (isFunctionPtr) isFunctionPtr[0] = true
        return fillFunctionArgs ? result.param : undefined
    }
    if (result instanceof DefaultMethod) {
        if (isFunctionPtr) isFunctionPtr[0] = true
        return fillFunctionArgs ? result.arg : undefined
    }
    if (fillNullableDefault) return result ?? ""
    return result
}

const pointEquals = (a: PointType, b: PointType | number) => {
    if (typeof b === "number") return a.x === b && a.y === b && (a.z ?? b) === b
    return a.x === b.x && a.y === b.y && a.z === b.z
}

export const equalsDefaultValue = (
    val: any,
    defaults: Defaults<any>,
    key: string
) => {
    const result = readLazy(defaults[key])
    if (result instanceof NullableDefault) {
        const { value } = result
        if (isPoint(value)) return pointEquals(value, val)
        if (isPoint(val)) return pointEquals(val, value)
        return val === value || val === undefined
    }
    if (result instanceof NullableCallback) return val === undefined
    if (isPoint(result)) return pointEquals(result, val)
    if (isPoint(val)) return pointEquals(val, result)
    return val === result || val === ""
}

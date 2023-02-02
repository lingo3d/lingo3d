import { isLazy } from "@lincode/utils"
import { isPoint, PointType } from "../../api/serializer/isPoint"
import Defaults from "./Defaults"
import NullableDefault from "./NullableDefault"

const readLazy = <T>(val: T | (() => T)): T =>
    typeof val === "function" && isLazy(val) ? val() : val

export default (
    defaults: Defaults<any>,
    key: string,
    fillNullableDefault?: boolean
) => {
    const result = readLazy(defaults[key])
    if (result instanceof NullableDefault)
        return fillNullableDefault ? result.value : undefined
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
    if (isPoint(result)) return pointEquals(result, val)
    if (isPoint(val)) return pointEquals(val, result)
    return val === result || val === ""
}

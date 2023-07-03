import toFixed, { toFixedPoint } from "../api/serializer/toFixed"
import DefaultMethod from "../interface/utils/DefaultMethod"
import { isPoint } from "../typeGuards/isPoint"

const getRuntimeValue = (target: any, key: string) => {
    if (target.runtimeData && key in target.runtimeData)
        return target.runtimeData[key]
    return target[key]
}

export const getFixedRuntimeValue = (target: any, key: string) => {
    const result = getRuntimeValue(target, key)
    if (typeof result === "number") return toFixed(result)
    if (isPoint(result)) return toFixedPoint(result)
    return result
}

export const setRuntimeValue = (
    target: any,
    defaults: any,
    key: string,
    value: any
) => {
    if (target.runtimeData && key in target.runtimeData) {
        target.runtimeData[key] = value
        return
    }
    if (defaults[key] instanceof DefaultMethod) {
        target[key](value)
        return
    }
    target[key] = value
}

import toFixed, { toFixedPoint } from "../api/serializer/toFixed"
import { isPoint } from "../typeGuards/isPoint"

export const getFixedRuntimeValue = (target: any, key: string) => {
    const result = target[key]
    if (typeof result === "number") return toFixed(result)
    if (isPoint(result)) return toFixedPoint(result)
    return result
}

import { Point3dType, PointType, isPoint } from "../../typeGuards/isPoint"

const toFixed = (v: number, places = 2) => Number(v.toFixed(places))
export default toFixed

export const toNullableFixed = (v: number | undefined) =>
    v === undefined ? undefined : toFixed(v)

export const toFixedPoint = (value: PointType | Point3dType) => {
    if ("z" in value)
        return {
            x: toFixed(value.x),
            y: toFixed(value.y),
            z: toFixed(value.z)
        }
    return {
        x: toFixed(value.x),
        y: toFixed(value.y)
    }
}

export const getFixedValue = (target: any, key: string) => {
    const result = target[key]
    if (typeof result === "number") return toFixed(result)
    if (isPoint(result)) return toFixedPoint(result)
    return result
}

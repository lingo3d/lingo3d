import { PointType } from "../../utils/isPoint"

const toFixed = (v: number, places = 2) => Number(v.toFixed(places))
export default toFixed

export const toNullableFixed = (v: number | undefined) =>
    v === undefined ? undefined : toFixed(v)

export const toFixedPoint = (value: PointType) => {
    if (value.z !== undefined)
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

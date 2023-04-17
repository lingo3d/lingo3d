import { PointType } from "../../utils/isPoint"

const toFixed = (v: number) => Number(v.toFixed(2))
export default toFixed

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

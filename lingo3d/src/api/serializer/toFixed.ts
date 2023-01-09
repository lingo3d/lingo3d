import { Point, Point3d } from "@lincode/math"

const toFixed = (v: number) => Number(v.toFixed(2))
export default toFixed

export const toFixedPoint = (value: Point | Point3d) => {
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

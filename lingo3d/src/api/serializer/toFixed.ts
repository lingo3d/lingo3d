import { Point, Point3d } from "@lincode/math"

const toFixed = (key: string, v: number) => Number(v.toFixed(2))
export default toFixed

export const toFixedPoint = (value: Point | Point3d) => {
    if ("z" in value)
        return {
            x: toFixed("x", value.x),
            y: toFixed("y", value.y),
            z: toFixed("z", value.z)
        }
    return {
        x: toFixed("x", value.x),
        y: toFixed("y", value.y)
    }
}

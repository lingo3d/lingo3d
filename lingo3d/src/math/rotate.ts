import { Point3dType } from "../typeGuards/isPoint"
import Point3d from "./Point3d"

export default (a: Point3dType, axis: Point3dType, angle: number) => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const dot = a.x * axis.x + a.y * axis.y + a.z * axis.z
    return new Point3d(
        (a.x - axis.x * dot) * cos +
            dot * axis.x +
            (-axis.z * a.y + axis.y * a.z) * sin,
        (a.y - axis.y * dot) * cos +
            dot * axis.y +
            (axis.z * a.x - axis.x * a.z) * sin,
        (a.z - axis.z * dot) * cos +
            dot * axis.z +
            (-axis.y * a.x + axis.x * a.y) * sin
    )
}

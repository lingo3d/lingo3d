import { Point3dType } from "../typeGuards/isPoint"
import Point3d from "./Point3d"

export default (a: Point3dType, b: Point3dType) => {
    const dot = a.x * b.x + a.y * b.y + a.z * b.z
    return new Point3d(
        a.x - 2 * dot * b.x,
        a.y - 2 * dot * b.y,
        a.z - 2 * dot * b.z
    )
}

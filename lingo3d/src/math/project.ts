import { Point3dType } from "../typeGuards/isPoint"
import Point3d from "./Point3d"

export default (a: Point3dType, b: Point3dType) => {
    const dot = a.x * b.x + a.y * b.y + a.z * b.z
    return new Point3d(dot * b.x, dot * b.y, dot * b.z)
}

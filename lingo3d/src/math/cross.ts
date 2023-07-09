import { Point3dType } from "../typeGuards/isPoint"
import Point3d from "./Point3d"

export default (a: Point3dType, b: Point3dType) =>
    new Point3d(
        a.y * b.z - a.z * b.y,
        a.z * b.x - a.x * b.z,
        a.x * b.y - a.y * b.x
    )

import { Point3dType } from "../typeGuards/isPoint"
import Point3d from "./Point3d"

export default (a: Point3dType, b: number) =>
    new Point3d(a.x * b, a.y * b, a.z * b)

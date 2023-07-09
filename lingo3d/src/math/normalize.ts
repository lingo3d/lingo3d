import { Point3dType } from "../typeGuards/isPoint"
import Point3d from "./Point3d"

export default (a: Point3dType) => {
    const length = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)
    return new Point3d(a.x / length, a.y / length, a.z / length)
}

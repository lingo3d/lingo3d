import { Point3dType } from "../typeGuards/isPoint"
import Point3d from "./Point3d"

export default (a: Point3dType, angle: number) => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return new Point3d(a.x * cos + a.z * sin, a.y, -a.x * sin + a.z * cos)
}

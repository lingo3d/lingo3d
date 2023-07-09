import { Point3dType } from "../typeGuards/isPoint"

export default (a: Point3dType, b: Point3dType) =>
    a.x * b.x + a.y * b.y + a.z * b.z

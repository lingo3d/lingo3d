import { Point3dType } from "../typeGuards/isPoint"

export default (a: Point3dType, b: Point3dType) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2)

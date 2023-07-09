import { Point3dType } from "../typeGuards/isPoint"

export default (a: Point3dType) => Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2)

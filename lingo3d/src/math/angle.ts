import { RAD2DEG } from "three/src/math/MathUtils"
import { Point3dType } from "../typeGuards/isPoint"

export default (a: Point3dType, b: Point3dType) => {
    const dot = a.x * b.x + a.y * b.y + a.z * b.z
    const length =
        Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z) *
        Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z)
    return Math.acos(dot / length) * RAD2DEG
}

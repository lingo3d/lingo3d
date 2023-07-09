import { RAD2DEG } from "three/src/math/MathUtils"
import { PointType } from "../typeGuards/isPoint"
import distance from "./distance"

export default (
    vertex: PointType,
    pt1: PointType,
    pt2: PointType,
    reflex?: boolean
) => {
    const p01 = distance(vertex, pt1)
    const p02 = distance(vertex, pt2)
    const p12 = distance(pt1, pt2)
    const angle =
        Math.acos((p01 * p01 + p02 * p02 - p12 * p12) / (2 * p01 * p02)) *
        RAD2DEG
    return reflex ? 360 - angle : angle
}

import { DEG2RAD } from "three/src/math/MathUtils"
import { PointType } from "../typeGuards/isPoint"
import Point from "./Point"

export default (pt: PointType, origin: PointType, theta: number) => {
    const rad = theta * DEG2RAD
    const deltaX = pt.x - origin.x
    const deltaY = pt.y - origin.y
    const rotatedX = deltaX * Math.cos(rad) - deltaY * Math.sin(rad)
    const rotatedY = deltaX * Math.sin(rad) + deltaY * Math.cos(rad)

    return new Point(rotatedX + origin.x, rotatedY + origin.y)
}

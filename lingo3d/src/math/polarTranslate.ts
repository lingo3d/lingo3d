import { DEG2RAD } from "three/src/math/MathUtils"
import Point from "./Point"

export default (x: number, y: number, theta: number, dist: number) => {
    const rad = (theta *= DEG2RAD)
    return new Point(x + dist * Math.cos(rad), y + dist * Math.sin(rad))
}

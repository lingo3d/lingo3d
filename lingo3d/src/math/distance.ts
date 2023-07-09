import { PointType } from "../typeGuards/isPoint"

export default (a: PointType, b: PointType) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)

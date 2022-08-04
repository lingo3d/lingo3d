import { Point3d } from "@lincode/math"
import { Vector3 } from "three"
import { scaleDown, scaleUp } from "../../engine/constants"

export const vec2Point = (vec: Vector3) =>
    new Point3d(vec.x * scaleUp, vec.y * scaleUp, vec.z * scaleUp)

export const point2Vec = (point: Point3d) =>
    new Vector3(point.x * scaleDown, point.y * scaleDown, point.z * scaleDown)

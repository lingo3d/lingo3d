import { Vector3 } from "three"
import Point3d from "../../api/Point3d"
import { scaleDown, scaleUp } from "../../engine/constants"

export const vec2Point = (vec: Vector3) => new Point3d(vec.x * scaleUp, vec.y * scaleUp, vec.z * scaleUp)

export const point2Vec = (point: { x: number, y: number, z: number }) => new Vector3(point.x * scaleDown, point.y * scaleDown, point.z * scaleDown)
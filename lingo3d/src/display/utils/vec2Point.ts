import { Point3d } from "@lincode/math"
import { Vector3 } from "three"
import { CM2M, M2CM } from "../../globals"

export const vec2Point = (vec: Vector3) =>
    new Point3d(vec.x * M2CM, vec.y * M2CM, vec.z * M2CM)

export const point2Vec = (point: Point3d) =>
    new Vector3(point.x * CM2M, point.y * CM2M, point.z * CM2M)

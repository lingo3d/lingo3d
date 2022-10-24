import {
    Box3,
    MeshBasicMaterial,
    Quaternion,
    Vector3,
    Ray,
    Euler,
    Line3,
    Frustum,
    Matrix4,
    MeshStandardMaterial
} from "three"
import { diameterScaled, radiusScaled } from "../../engine/constants"

export const vector3 = new Vector3()
export const vector3_ = new Vector3()
export const vector3__ = new Vector3()

export const quaternion = new Quaternion()
export const quaternion_ = new Quaternion()

export const vector3_0 = new Vector3(0, 0, 0)

export const vector3_1 = new Vector3(
    diameterScaled,
    diameterScaled,
    diameterScaled
)

export const vector3_half = new Vector3(
    radiusScaled,
    radiusScaled,
    radiusScaled
)

export const box3 = new Box3()
export const ray = new Ray()
export const euler = new Euler(0, 0, 0, "YXZ")

export const line3 = new Line3()

export const frustum = new Frustum()

export const matrix4 = new Matrix4()

export const halfPi = Math.PI * 0.5

export const wireframeMaterial = new MeshBasicMaterial({ wireframe: true })
export const standardMaterial = new MeshStandardMaterial()

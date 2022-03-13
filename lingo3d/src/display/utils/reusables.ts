import { Box3, MeshBasicMaterial, Quaternion, Vector3, Ray, Euler } from "three"
import { diameterScaled, radiusScaled } from "../../engine/constants"

export const vector3 = new Vector3()
export const vector3_ = new Vector3()

export const vector3_1 = new Vector3(diameterScaled, diameterScaled, diameterScaled)
Object.freeze(vector3_1)

export const vector3_half = new Vector3(radiusScaled, radiusScaled, radiusScaled)
Object.freeze(vector3_half)

export const box3 = new Box3()
export const quaternion = new Quaternion()
export const wireframeMaterial = new MeshBasicMaterial({ wireframe: true })

export const ray = new Ray()

export const euler = new Euler(0, 0, 0, "YXZ")
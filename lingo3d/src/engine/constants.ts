import { mapRange } from "@lincode/math"

const scale = 100

export const scaleDown = 1 / scale
export const scaleUp = scale
export const scaleInverse = mapRange(scale, 1, 100, 100, 1)

export const camNear = 0.1
export const camFar = 10000 * scaleInverse

export const flatGeomScaleZ = Number.EPSILON
export const diameterScaled = 100 * scaleDown
export const radiusScaled = diameterScaled * 0.5
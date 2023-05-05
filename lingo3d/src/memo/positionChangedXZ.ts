import { Object3D, Vector3 } from "three"
import getWorldPosition from "./getWorldPosition"
import computePerFrame from "./utils/computePerFrame"

const positionXZCache = new WeakMap<Object3D, Vector3>()

export const positionChangedXZ = computePerFrame((target: Object3D) => {
    const position = getWorldPosition(target)
    const positionOld = positionXZCache.get(target)
    const result = positionOld
        ? position.x !== positionOld.x || position.z !== positionOld.z
        : true
    positionXZCache.set(target, position)
    return result
})

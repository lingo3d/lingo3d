import { Object3D, Quaternion, Vector3 } from "three"
import computePerFrame from "../../utils/computePerFrame"
import getWorldPosition from "./getWorldPosition"
import getWorldQuaternion from "./getWorldQuaternion"

const positionCache = new WeakMap<Object3D, Vector3>()
const positionXZCache = new WeakMap<Object3D, Vector3>()
const quaternionCache = new WeakMap<Object3D, Quaternion>()

export const positionChanged = computePerFrame((target: Object3D) => {
    const position = getWorldPosition(target)
    const positionOld = positionCache.get(target)
    const result = positionOld ? !position.equals(positionOld) : false
    positionCache.set(target, position)
    return result
})

export const positionChangedXZ = computePerFrame((target: Object3D) => {
    const position = getWorldPosition(target)
    const positionOld = positionXZCache.get(target)
    const result = positionOld
        ? position.x !== positionOld.x || position.z !== positionOld.z
        : false
    positionXZCache.set(target, position)
    return result
})

export const quaternionChanged = computePerFrame((target: Object3D) => {
    const quaternion = getWorldQuaternion(target)
    const quaternionOld = quaternionCache.get(target)
    const result = quaternionOld ? !quaternion.equals(quaternionOld) : false
    quaternionCache.set(target, quaternion)
    return result
})

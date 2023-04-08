import { Object3D, Quaternion } from "three"
import getWorldQuaternion from "./getWorldQuaternion"
import computePerFrame from "./utils/computePerFrame"

const quaternionCache = new WeakMap<Object3D, Quaternion>()

export const quaternionChanged = computePerFrame((target: Object3D) => {
    const quaternion = getWorldQuaternion(target)
    const quaternionOld = quaternionCache.get(target)
    const result = quaternionOld ? !quaternion.equals(quaternionOld) : true
    quaternionCache.set(target, quaternion)
    return result
})

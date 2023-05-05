import { Object3D, Vector3 } from "three"
import getWorldPosition from "./getWorldPosition"
import computePerFrame from "./utils/computePerFrame"

const positionCache = new WeakMap<Object3D, Vector3>()

export const positionChanged = computePerFrame((target: Object3D) => {
    const position = getWorldPosition(target)
    const positionOld = positionCache.get(target)
    const result = positionOld ? !position.equals(positionOld) : true
    positionCache.set(target, position)
    return result
})

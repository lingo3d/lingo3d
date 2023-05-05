import { Object3D } from "three"
import computePerFrame from "./utils/computePerFrame"

const castShadowCache = new WeakMap<Object3D, boolean>()

export const castShadowChanged = computePerFrame((target: Object3D) => {
    const { castShadow } = target
    const castShadowOld = castShadowCache.get(target)
    const result = castShadow !== castShadowOld
    castShadowCache.set(target, castShadow)
    return result
})

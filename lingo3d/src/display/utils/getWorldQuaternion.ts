import { Object3D, Quaternion } from "three"
import { onAfterRender } from "../../events/onAfterRender"

const cache = new WeakMap<Object3D, Quaternion>()

export default (object3d: Object3D) => {
    if (cache.has(object3d))
        return cache.get(object3d)!.clone()

    const result = object3d.getWorldQuaternion(new Quaternion())

    cache.set(object3d, result.clone())
    onAfterRender(() => cache.delete(object3d), true)

    return result
}
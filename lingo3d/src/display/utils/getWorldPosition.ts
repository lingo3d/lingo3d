import { Object3D, Vector3 } from "three"

const cache = new WeakMap<Object3D, Vector3>()

export default (object3d: Object3D) => {
    if (cache.has(object3d))
        return cache.get(object3d)!

    const result = object3d.getWorldPosition(new Vector3())

    cache.set(object3d, result)
    setTimeout(() => cache.delete(object3d))

    return result
}
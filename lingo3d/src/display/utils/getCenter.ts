import { Bone, Object3D, Vector3 } from "three"
import getWorldPosition from "./getWorldPosition"
import { box3, vector3 } from "./reusables"

const cache = new WeakMap<Object3D, Vector3>()

export default (object: Object3D) => {
    if (cache.has(object))
        return cache.get(object)!

    const result = object instanceof Bone
        ? getWorldPosition(object)
        : box3.setFromObject(object).getCenter(vector3).clone()

    cache.set(object, result)
    setTimeout(() => cache.delete(object))

    return result
}
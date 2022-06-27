import { Bone, Object3D, Vector3 } from "three"
import { onAfterRender } from "../../events/onAfterRender"
import getWorldPosition from "./getWorldPosition"
import { box3 } from "./reusables"

const cache = new WeakMap<Object3D, Vector3>()

export default (object: Object3D) => {
    if (cache.has(object))
        return cache.get(object)!.clone()

    const result = object instanceof Bone
        ? getWorldPosition(object)
        : box3.setFromObject(object).getCenter(new Vector3())

    cache.set(object, result.clone())
    onAfterRender(() => cache.delete(object), true)

    return result
}
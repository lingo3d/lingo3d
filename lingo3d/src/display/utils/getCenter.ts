import { Bone, Object3D, Vector3 } from "three"
import { onAfterRender } from "../../events/onAfterRender"
import getWorldPosition from "./getWorldPosition"
import { box3 } from "./reusables"

const cache = new WeakMap<Object3D, Vector3>()

export default (object: Object3D) => {
    if (cache.has(object)) return cache.get(object)!.clone()

    let result: Vector3
    if (object instanceof Bone) {
        result = getWorldPosition(object)
    } else {
        object.updateWorldMatrix(true, false)
        box3.setFromObject(object)
        if (box3.isEmpty()) result = getWorldPosition(object)
        else result = box3.getCenter(new Vector3())
    }
    cache.set(object, result.clone())
    onAfterRender(() => cache.delete(object), true)

    return result
}

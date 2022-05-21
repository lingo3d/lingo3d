import PhysicsItem from "../core/SimpleObjectManager/PhysicsItem"
import { Vector3 } from "three"

const cache = new WeakMap<PhysicsItem, Vector3>()

export default (target: PhysicsItem) => {
    if (cache.has(target))
        return cache.get(target)!

    const result = target.object3d.scale.clone().multiply(target.outerObject3d.scale)

    cache.set(target, result)
    setTimeout(() => cache.delete(target))

    return result
}
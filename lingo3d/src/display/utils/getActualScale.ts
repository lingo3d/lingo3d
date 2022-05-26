import { Vector3 } from "three"
import PositionedItem from "../../api/core/PositionedItem"

const cache = new WeakMap<PositionedItem, Vector3>()

export default (target: PositionedItem) => {
    if (cache.has(target))
        return cache.get(target)!

    const result = (target.object3d ?? target.outerObject3d).scale.clone().multiply(target.outerObject3d.scale)

    cache.set(target, result)
    setTimeout(() => cache.delete(target))

    return result
}
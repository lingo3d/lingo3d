import { Vector3 } from "three"
import PositionedItem from "../../api/core/PositionedItem"
import { getObject3d } from "../core/MeshItem"

const cache = new WeakMap<PositionedItem, Vector3>()

export default (target: PositionedItem) => {
    if (cache.has(target))
        return cache.get(target)!

    const result = getObject3d(target).scale.clone().multiply(target.outerObject3d.scale)

    cache.set(target, result)
    setTimeout(() => cache.delete(target))

    return result
}
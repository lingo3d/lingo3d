import { Vector3 } from "three"
import MeshItem, { getObject3d } from "../core/MeshItem"

const cache = new WeakMap<MeshItem, Vector3>()

export default (target: MeshItem) => {
    if (cache.has(target))
        return cache.get(target)!

    const result = getObject3d(target).scale.clone().multiply(target.outerObject3d.scale)

    cache.set(target, result)
    setTimeout(() => cache.delete(target))

    return result
}
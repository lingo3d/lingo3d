import { Vector3 } from "three"
import { onAfterRender } from "../../events/onAfterRender"
import MeshItem, { getObject3d } from "../core/MeshItem"

const cache = new WeakMap<MeshItem, Vector3>()

export default (target: MeshItem) => {
    if (cache.has(target))
        return cache.get(target)!.clone()

    const result = getObject3d(target).scale.clone().multiply(target.outerObject3d.scale)

    cache.set(target, result.clone())
    onAfterRender(() => cache.delete(target), true)

    return result
}
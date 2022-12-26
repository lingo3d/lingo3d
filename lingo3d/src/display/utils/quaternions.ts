import { Object3D, Quaternion } from "three"
import scene from "../../engine/scene"
import { quaternion } from "./reusables"

export const worldToLocalQuaternion = (
    object3d: Object3D,
    worldQuaternion: Quaternion
) => {
    const parents: Array<Object3D> = []
    let parent = object3d.parent
    while (parent && parent !== scene) {
        parents.push(parent)
        parent = parent.parent
    }
    for (const parent of parents.reverse())
        worldQuaternion.premultiply(quaternion.copy(parent.quaternion).invert())
    return worldQuaternion
}

export const diffQuaternions = (from: Quaternion, to: Quaternion) =>
    from.clone().invert().multiply(to)

export const complementQuaternion = (to: Quaternion, diff: Quaternion) =>
    to.multiply(quaternion.copy(diff).invert())

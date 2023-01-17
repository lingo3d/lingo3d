import { Object3D, Quaternion } from "three"
import scene from "../../engine/scene"
import { quaternion } from "./reusables"

export const worldToLocalQuaternion = (
    target: Object3D,
    worldQuaternion: Quaternion
) => {
    let parents: Array<Object3D> = target.userData.parents
    if (!parents) {
        parents = target.userData.parents = []
        let parent = target.parent
        while (parent && parent !== scene) {
            parents.push(parent)
            parent = parent.parent
        }
        parents.reverse()
    }
    for (const parent of parents)
        worldQuaternion.premultiply(quaternion.copy(parent.quaternion).invert())
    return worldQuaternion
}

export const diffQuaternions = (from: Quaternion, to: Quaternion) =>
    from.clone().invert().multiply(to)

export const complementQuaternion = (to: Quaternion, diff: Quaternion) =>
    to.multiply(quaternion.copy(diff).invert())

import { Object3D, Quaternion } from "three"

export const worldToLocalQuaternion = (
    object3d: Object3D,
    worldQuaternion: Quaternion
) => {
    const localQuaternion = worldQuaternion.clone()
    let parent = object3d.parent
    while (parent) {
        localQuaternion.premultiply(parent.quaternion.clone().invert())
        parent = parent.parent
    }
    return localQuaternion
}

export const diffQuaternions = (from: Quaternion, to: Quaternion) =>
    from.clone().invert().multiply(to)

export const complementQuaternion = (to: Quaternion, diff: Quaternion) =>
    to.multiply(diff.clone().invert())

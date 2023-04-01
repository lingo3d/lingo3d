import { Object3D } from "three"
import { clone } from "three/examples/jsm/utils/SkeletonUtils"
import { skinnedMeshSet } from "../../collections/skinnedMeshSet"

export default <T extends Object3D>(
    target: T,
    noBone: boolean,
    animations = target.animations
) => {
    const result = noBone ? target.clone() : clone(target)
    !noBone && skinnedMeshSet.add(result)
    result.animations = animations
    return result as T
}

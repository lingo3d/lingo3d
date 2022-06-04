import { Object3D } from "three"
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils"

export const skinnedMeshSet = new WeakSet<Object3D>()

export default <T extends Object3D>(target: T, noBone: boolean, animations = target.animations): T => {
    //@ts-ignore
    const clone = noBone ? target.clone() : SkeletonUtils.clone(target)
    !noBone && skinnedMeshSet.add(clone)
    clone.animations = animations
    return clone
}
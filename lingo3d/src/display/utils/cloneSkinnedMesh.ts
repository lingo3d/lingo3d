import { Object3D } from "three"
import { clone } from "three/examples/jsm/utils/SkeletonUtils"
import { noBoneSet } from "../../collections/noBoneSet"
import { noMeshSet } from "../../collections/noMeshSet"

export default <T extends Object3D>(
    target: T,
    noBone: boolean,
    noMesh: boolean,
    animations = target.animations
) => {
    const result = noBone ? target.clone() : clone(target)
    noBone && noBoneSet.add(result)
    noMesh && noMeshSet.add(result)
    result.animations = animations
    return result as T
}

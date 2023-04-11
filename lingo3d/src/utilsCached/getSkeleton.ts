import { Object3D, Skeleton, SkinnedMesh } from "three"
import computeOnce from "./utils/computeOnce"

const _getSkeleton = (object: Object3D | SkinnedMesh): Skeleton | undefined => {
    if ("skeleton" in object) return object.skeleton
    for (const child of object.children) {
        const result = _getSkeleton(child)
        if (result) return result
    }
}

export const getSkeleton = computeOnce((object: Object3D | SkinnedMesh) =>
    _getSkeleton(object)
)

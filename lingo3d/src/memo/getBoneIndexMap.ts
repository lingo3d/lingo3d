import { Bone, Skeleton } from "three"
import computeOnce from "./utils/computeOnce"

export const getBoneIndexMap = computeOnce((skeleton: Skeleton) => {
    const map = new WeakMap<Bone, number>()
    for (let i = 0; i < skeleton.bones.length; i++)
        map.set(skeleton.bones[i], i)
    return map
})

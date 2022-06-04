import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { Bone, Group, LinearEncoding } from "three"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { decreaseLoadingCount, increaseLoadingCount } from "../../../states/useLoadingCount"
import { handleProgress } from "./bytesLoaded"

const cache = new Map<string, Promise<[Group, boolean]>>()
const loader = new FBXLoader()

export default async (url: string, clone: boolean) => {
    const [group, noBone] = await forceGet(cache, url, () => new Promise<[Group, boolean]>((resolve, reject) => {
        increaseLoadingCount()
        loader.load(url, group => {
            decreaseLoadingCount()

            let noBone = true
            group.traverse((child: any) => {
                noBone && child instanceof Bone && (noBone = false)

                child.material?.map && (child.material.map.encoding = LinearEncoding)
                // child.castShadow = true
                // child.receiveShadow = true
            })
            resolve([group, noBone])
        },
        handleProgress,
        () => {
            decreaseLoadingCount()
            reject()
        })
    }))
    if (clone)
        return cloneSkinnedMesh(group, noBone)
        
    return group
}
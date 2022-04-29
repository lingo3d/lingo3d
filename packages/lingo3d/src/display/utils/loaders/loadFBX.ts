import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { Group, LinearEncoding, sRGBEncoding } from "three"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { decreaseLoadingCount, increaseLoadingCount } from "../../../states/useLoadingCount"
import { handleProgress } from "./bytesLoaded"
import { getEncoding } from "../../../states/useEncoding"

const cache = new Map<string, Promise<Group>>()
const loader = new FBXLoader()

export default async (url: string, clone: boolean) => {
    const group = await forceGet(cache, url, () => new Promise<Group>((resolve, reject) => {
        increaseLoadingCount()
        loader.load(url, group => {
            decreaseLoadingCount()
            getEncoding() === "linear"
                ? group.traverse((child: any) => {
                    child.material?.map && (child.material.map.encoding = LinearEncoding)
                    // child.castShadow = true
                    // child.receiveShadow = true
                })
                : group.traverse((child: any) => {
                    child.material?.map && (child.material.map.encoding = sRGBEncoding)
                    // child.castShadow = true
                    // child.receiveShadow = true
                })
            resolve(group)
        },
        handleProgress,
        () => {
            decreaseLoadingCount()
            reject()
        })
    }))
    if (clone)
        return cloneSkinnedMesh(group)
        
    return group
}
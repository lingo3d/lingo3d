import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { Group, LinearEncoding } from "three"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { decreaseLoadingCount, increaseLoadingCount } from "../../../states/useLoadingCount"

const cache = new Map<string, Promise<Group>>()
const loader = new FBXLoader()

export default async (url: string) => {
    const group = await forceGet(cache, url, () => new Promise<Group>((resolve, reject) => {
        increaseLoadingCount()
        loader.load(url, group => {
            decreaseLoadingCount()
            group.traverse((child: any) => {
                child.material?.map && (child.material.map.encoding = LinearEncoding)
                // child.castShadow = true
                // child.receiveShadow = true
            })
            resolve(group)
        },
        undefined,
        () => {
            decreaseLoadingCount()
            reject()
        })
    }))
    return cloneSkinnedMesh(group)
}
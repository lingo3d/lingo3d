import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { Bone, Group, LinearEncoding, MeshStandardMaterial } from "three"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { decreaseLoadingCount, increaseLoadingCount } from "../../../states/useLoadingCount"
import { handleProgress } from "./bytesLoaded"
import copyStandard from "../../core/StaticObjectManager/applyMaterialProperties/copyStandard"

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

                const {material} = child
                if (!material) return

                material.map && (material.map.encoding = LinearEncoding)
                copyStandard(material, child.material = new MeshStandardMaterial())
                material.dispose()
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
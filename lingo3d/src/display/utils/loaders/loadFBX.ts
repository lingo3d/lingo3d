import { FBXLoader } from "./loaders/FBXLoader"
import { Bone, Group, Light } from "three"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { handleProgress } from "./bytesLoaded"
import {
    decreaseLoadingUnpkgCount,
    increaseLoadingUnpkgCount
} from "../../../states/useLoadingUnpkgCount"

const cache = new Map<string, Promise<[Group, boolean]>>()
const loader = new FBXLoader()

export default async (url: string, clone: boolean) => {
    const [group, noBone] = await forceGet(
        cache,
        url,
        () =>
            new Promise<[Group, boolean]>((resolve, reject) => {
                const unpkg = url.startsWith("https://unpkg.com/")
                unpkg && increaseLoadingUnpkgCount()
                loader.load(
                    url,
                    (group: Group) => {
                        const lights: Array<Light> = []

                        let noBone = true
                        group.traverse((child) => {
                            if (child instanceof Light) lights.push(child)
                            else if (noBone && child instanceof Bone)
                                noBone = false

                            child.castShadow = true
                            child.receiveShadow = true
                        })
                        for (const light of lights) light.parent?.remove(light)

                        unpkg && decreaseLoadingUnpkgCount()
                        resolve([group, noBone])
                    },
                    handleProgress(url),
                    reject
                )
            })
    )
    if (clone) return cloneSkinnedMesh(group, noBone)

    return group
}

import { FBXLoader } from "./loaders/FBXLoader"
import { Bone, Group, Light } from "three"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import {
    decreaseLoadingCount,
    increaseLoadingCount
} from "../../../states/useLoadingCount"
import { handleProgress } from "./bytesLoaded"

const cache = new Map<string, Promise<[Group, boolean]>>()
const loader = new FBXLoader()

export default async (url: string, clone: boolean) => {
    const [group, noBone] = await forceGet(
        cache,
        url,
        () =>
            new Promise<[Group, boolean]>((resolve, reject) => {
                increaseLoadingCount()
                loader.load(
                    url,
                    (group: any) => {
                        decreaseLoadingCount()

                        const lights: Array<Light> = []

                        let noBone = true
                        group.traverse((child: any) => {
                            if (child instanceof Light) lights.push(child)
                            else if (noBone && child instanceof Bone)
                                noBone = false

                            child.castShadow = true
                            child.receiveShadow = true
                            child.frustumCulled = false
                        })
                        for (const light of lights) light.parent?.remove(light)

                        resolve([group, noBone])
                    },
                    handleProgress(url),
                    () => {
                        decreaseLoadingCount()
                        reject()
                    }
                )
            })
    )
    if (clone) return cloneSkinnedMesh(group, noBone)

    return group
}

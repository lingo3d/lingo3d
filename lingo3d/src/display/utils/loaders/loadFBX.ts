import { FBXLoader } from "./loaders/FBXLoader"
import { Group } from "three"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { handleProgress } from "./utils/bytesLoaded"
import {
    decreaseLoadingAssetsCount,
    increaseLoadingAssetsCount
} from "../../../states/useLoadingAssetsCount"
import processChildren from "./utils/processChildren"
import { assetsPathPtr } from "../../../pointers/assetsPathPtr"

const cache = new Map<string, Promise<[Group, boolean]>>()
const loader = new FBXLoader()

export default async (url: string, clone: boolean) => {
    const [group, noBone] = await forceGet(
        cache,
        url,
        () =>
            new Promise<[Group, boolean]>((resolve, reject) => {
                const isAssets = url.startsWith(assetsPathPtr[0])
                isAssets && increaseLoadingAssetsCount()
                loader.load(
                    url,
                    (group: Group) => {
                        const noBonePtr: [boolean] = [true]
                        processChildren(group, noBonePtr)

                        isAssets && decreaseLoadingAssetsCount()
                        resolve([group, noBonePtr[0]])
                    },
                    handleProgress(url),
                    reject
                )
            })
    )
    if (clone) return cloneSkinnedMesh(group, noBone)

    return group
}

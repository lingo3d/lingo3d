import { FBXLoader } from "./loaders/FBXLoader"
import { Group } from "three"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { handleProgress } from "./utils/bytesLoaded"
import processChildren from "./utils/processChildren"
import { busyCountPtr } from "../../../pointers/busyCountPtr"
import { createMap } from "../../../utils/createCollection"

const cache = createMap<string, Promise<[Group, boolean]>>()
const loader = new FBXLoader()

export default async (url: string, clone: boolean) => {
    const [group, noBone] = await forceGet(
        cache,
        url,
        () =>
            new Promise<[Group, boolean]>((resolve, reject) => {
                busyCountPtr[0]++
                loader.load(
                    url,
                    (group: Group) => {
                        const noBonePtr: [boolean] = [true]
                        processChildren(group, noBonePtr)
                        busyCountPtr[0]--
                        resolve([group, noBonePtr[0]])
                    },
                    handleProgress(url),
                    () => {
                        busyCountPtr[0]--
                        reject()
                    }
                )
            })
    )
    if (clone) return cloneSkinnedMesh(group, noBone)

    return group
}

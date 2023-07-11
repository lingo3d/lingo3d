import { FBXLoader } from "./loaders/FBXLoader"
import { Group } from "three"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { handleProgress } from "./utils/bytesLoaded"
import processChildren from "./utils/processChildren"
import { createUnloadMap } from "../../../utils/createUnloadMap"
import {
    addBusyProcess,
    deleteBusyProcess
} from "../../../collections/busyProcesses"

const cache = createUnloadMap<string, Promise<[Group, boolean]>>()
const loader = new FBXLoader()

export default async (url: string, clone: boolean) => {
    const [group, noBone] = await forceGet(
        cache,
        url,
        () =>
            new Promise<[Group, boolean]>((resolve, reject) => {
                addBusyProcess("loadFBX")
                loader.load(
                    url,
                    (group: Group) => {
                        const noBonePtr: [boolean] = [true]
                        processChildren(group, noBonePtr)
                        deleteBusyProcess("loadFBX")
                        resolve([group, noBonePtr[0]])
                    },
                    handleProgress(url),
                    () => {
                        deleteBusyProcess("loadFBX")
                        reject()
                    }
                )
            })
    )
    if (clone) return cloneSkinnedMesh(group, noBone)

    return group
}

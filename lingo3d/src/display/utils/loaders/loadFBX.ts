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

type Result = [Group, boolean, boolean]

const cache = createUnloadMap<string, Promise<Result>>()
const loader = new FBXLoader()

export default async (url: string, clone: boolean) => {
    const [group, noBone, noMesh] = await forceGet(
        cache,
        url,
        () =>
            new Promise<Result>((resolve, reject) => {
                addBusyProcess("loadFBX")
                loader.load(
                    url,
                    (group: Group) => {
                        const noBonePtr: [boolean] = [true]
                        const noMeshPtr: [boolean] = [true]
                        processChildren(group, noBonePtr, noMeshPtr)
                        deleteBusyProcess("loadFBX")
                        resolve([group, noBonePtr[0], noMeshPtr[0]])
                    },
                    handleProgress(url),
                    () => {
                        deleteBusyProcess("loadFBX")
                        reject()
                    }
                )
            })
    )
    if (clone) return cloneSkinnedMesh(group, noBone, noMesh)
    return group
}

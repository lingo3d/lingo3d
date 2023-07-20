import { BVHLoader } from "three/examples/jsm/loaders/BVHLoader"
import { forceGet } from "@lincode/utils"
import { handleProgress } from "./utils/bytesLoaded"
import { createUnloadMap } from "../../../utils/createUnloadMap"
import {
    addBusyProcess,
    deleteBusyProcess
} from "../../../collections/busyProcesses"
import { Group } from "three"
import cloneSkinnedMesh from "../cloneSkinnedMesh"

type Result = [Group, boolean, boolean]

const cache = createUnloadMap<string, Promise<Result>>()
export const loader = new BVHLoader()

export default async (url: string, clone: boolean) => {
    const [group, noBone, noMesh] = await forceGet(
        cache,
        url,
        () =>
            new Promise<Result>((resolve, reject) => {
                addBusyProcess("loadBVH")
                loader.load(
                    url,
                    (bvh) => {
                        const group = new Group()
                        group.animations = [bvh.clip]
                        group.add(bvh.skeleton.bones[0])

                        deleteBusyProcess("loadBVH")
                        resolve([group, false, true])
                    },
                    handleProgress(url),
                    () => {
                        deleteBusyProcess("loadBVH")
                        reject()
                    }
                )
            })
    )
    if (clone) return cloneSkinnedMesh(group, noBone, noMesh)
    return group
}

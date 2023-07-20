import { BVH, BVHLoader } from "three/examples/jsm/loaders/BVHLoader"
import { forceGet } from "@lincode/utils"
import { handleProgress } from "./utils/bytesLoaded"
import { createUnloadMap } from "../../../utils/createUnloadMap"
import {
    addBusyProcess,
    deleteBusyProcess
} from "../../../collections/busyProcesses"
import { AnimationClip } from "three"

type Result = { animations: [AnimationClip] }

const cache = createUnloadMap<string, Promise<Result>>()
export const loader = new BVHLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<Result>((resolve, reject) => {
                addBusyProcess("loadBVH")
                loader.load(
                    url,
                    (bvh) => {
                        deleteBusyProcess("loadBVH")
                        resolve({ animations: [bvh.clip] })
                    },
                    handleProgress(url),
                    () => {
                        deleteBusyProcess("loadBVH")
                        reject()
                    }
                )
            })
    )

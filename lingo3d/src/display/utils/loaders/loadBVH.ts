import { BVH, BVHLoader } from "three/examples/jsm/loaders/BVHLoader"
import { forceGet } from "@lincode/utils"
import { handleProgress } from "./utils/bytesLoaded"
import { createUnloadMap } from "../../../utils/createUnloadMap"
import {
    addBusyProcess,
    deleteBusyProcess
} from "../../../collections/busyProcesses"

const cache = createUnloadMap<string, Promise<BVH>>()
export const loader = new BVHLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<BVH>((resolve, reject) => {
                addBusyProcess("loadBVH")
                loader.load(
                    url,
                    (bvh) => {
                        deleteBusyProcess("loadBVH")
                        resolve(bvh)
                    },
                    handleProgress(url),
                    () => {
                        deleteBusyProcess("loadBVH")
                        reject()
                    }
                )
            })
    )

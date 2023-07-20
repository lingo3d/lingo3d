import { BVHLoader } from "three/examples/jsm/loaders/BVHLoader"
import { forceGet } from "@lincode/utils"
import { handleProgress } from "./utils/bytesLoaded"
import { createUnloadMap } from "../../../utils/createUnloadMap"
import {
    addBusyProcess,
    deleteBusyProcess
} from "../../../collections/busyProcesses"
import { Group } from "three"

const cache = createUnloadMap<string, Promise<Group>>()
export const loader = new BVHLoader()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () =>
            new Promise<Group>((resolve, reject) => {
                addBusyProcess("loadBVH")
                loader.load(
                    url,
                    (bvh) => {
                        deleteBusyProcess("loadBVH")
                        const result = new Group()
                        result.animations = [bvh.clip]
                        resolve(result)
                    },
                    handleProgress(url),
                    () => {
                        deleteBusyProcess("loadBVH")
                        reject()
                    }
                )
            })
    )

import { Group } from "three"
import { splitFileName } from "@lincode/utils"
import {
    addBusyProcess,
    deleteBusyProcess
} from "../../../collections/busyProcesses"

export default async (url: string, clone: boolean) => {
    addBusyProcess("loadModel")

    const extension = splitFileName(url)[1]?.toLowerCase()
    const module =
        extension === "fbx"
            ? await import("./loadFBX")
            : extension === "gltf" || extension === "glb"
            ? await import("./loadGLTF")
            : extension === "bvh"
            ? await import("./loadBVH")
            : undefined

    if (!module) {
        deleteBusyProcess("loadModel")
        throw new Error(`Failed to load ${url}, check if src is correct`)
    }
    let result: Group
    try {
        result = await module.default(url, clone)
    } catch {
        deleteBusyProcess("loadModel")
        throw new Error(`Failed to load ${url}, check if src is correct`)
    }
    deleteBusyProcess("loadModel")
    result.position.set(0, 0, 0)
    return result
}

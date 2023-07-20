import { Group } from "three"
import { assert, splitFileName } from "@lincode/utils"
import {
    addBusyProcess,
    deleteBusyProcess
} from "../../../collections/busyProcesses"

const supported = new Set(["fbx", "glb", "gltf"])

export default async (url: string, clone: boolean) => {
    addBusyProcess("loadModel")

    const extension = splitFileName(url)[1]?.toLowerCase()
    if (!extension || !supported.has(extension)) {
        deleteBusyProcess("loadModel")
        throw new Error("Unsupported file extension " + extension)
    }
    const module =
        extension === "fbx"
            ? await import("./loadFBX")
            : extension === "gltf" || extension === "glb"
            ? await import("./loadGLTF")
            : extension === "bvh"
            ? await import("./loadBVH")
            : undefined

    assert(module, `Failed to load ${url}, check if src is correct`)

    let result: Group
    try {
        result = await module.default(url, clone)
    } catch {
        deleteBusyProcess("loadModel")
        throw new Error(`Failed to load ${url}, check if src is correct`)
    }
    deleteBusyProcess("loadModel")
    return result
}

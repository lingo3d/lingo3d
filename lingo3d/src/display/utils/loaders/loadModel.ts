import { Group } from "three"
import {
    increaseLoadingCount,
    decreaseLoadingCount
} from "../../../states/useLoadingCount"
import { splitFileName } from "@lincode/utils"
import { busyCountPtr } from "../../../pointers/busyCountPtr"

const supported = new Set(["fbx", "glb", "gltf"])

export default async (url: string, clone: boolean) => {
    increaseLoadingCount()
    busyCountPtr[0]++

    const extension = splitFileName(url)[1]?.toLowerCase()
    if (!extension || !supported.has(extension)) {
        decreaseLoadingCount()
        busyCountPtr[0]--
        throw new Error("Unsupported file extension " + extension)
    }
    const module =
        extension === "fbx"
            ? await import("./loadFBX")
            : await import("./loadGLTF")

    let result: Group
    try {
        result = await module.default(url, clone)
    } catch {
        decreaseLoadingCount()
        busyCountPtr[0]--
        throw new Error("Failed to load model, check if src is correct")
    }
    decreaseLoadingCount()
    busyCountPtr[0]--
    return result
}

import { Group } from "three"
import { splitFileName } from "@lincode/utils"
import { busyCountPtr } from "../../../pointers/busyCountPtr"

const supported = new Set(["fbx", "glb", "gltf"])

export default async (url: string, clone: boolean) => {
    busyCountPtr[0]++

    const extension = splitFileName(url)[1]?.toLowerCase()
    if (!extension || !supported.has(extension)) {
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
        busyCountPtr[0]--
        throw new Error("Failed to load model, check if src is correct")
    }
    busyCountPtr[0]--
    return result
}

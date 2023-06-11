import { Group } from "three"
import {
    increaseLoadingCount,
    decreaseLoadingCount
} from "../../../states/useLoadingCount"
import { splitFileName } from "@lincode/utils"

const supported = new Set(["fbx", "glb", "gltf"])

export default async (url: string, clone: boolean) => {
    increaseLoadingCount()

    const extension = splitFileName(url)[1]?.toLowerCase()
    if (!extension || !supported.has(extension)) {
        decreaseLoadingCount()
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
        throw new Error("Failed to load model, check if src is correct")
    }
    decreaseLoadingCount()
    return result
}

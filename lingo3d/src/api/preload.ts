import { getExtensionType } from "@lincode/filetypes"
import { assertExhaustive } from "@lincode/utils"
import { getExtensionIncludingObjectURL } from "../display/core/utils/objectURL"
import {
    addLoadedBytesChangedEventListeners,
    removeLoadedBytesChangedEventListeners
} from "../display/utils/loaders/bytesLoaded"
import loadTexturePromise from "../display/utils/loaders/loadTexturePromise"
import IModel from "../interface/IModel"
import { getLoadingCount } from "../states/useLoadingCount"
import Appendable from "./core/Appendable"

export const preloadModels = new WeakSet<Appendable>()

const preloadModelPromise = (properties: Partial<IModel>) =>
    new Promise<void>(async (resolve) => {
        const { default: Model } = await import("../display/Model")
        const model = new Model(true)
        Object.assign(model, properties)
        preloadModels.add(model)
        model.onLoad = resolve
    })

export default async (
    urls: Array<string | (Partial<IModel> & { src: string })>,
    total: number | string,
    onProgress?: (value: number) => void
) => {
    const promises: Array<Promise<any>> = []

    let totalBytes = 0
    if (typeof total === "number") totalBytes = total
    else {
        total = total.toLowerCase()
        if (total.endsWith("kb")) totalBytes = parseFloat(total) * 1024
        else if (total.endsWith("mb"))
            totalBytes = parseFloat(total) * 1024 * 1024
        else if (total.endsWith("gb"))
            totalBytes = parseFloat(total) * 1024 * 1024 * 1024
        else throw new Error("Invalid preload total value: " + total)
    }

    const handleLoadedBytesChanged = (bytes: number) => {
        onProgress?.(
            totalBytes <= 0 ? 0 : Math.min((bytes / totalBytes) * 100, 99)
        )
    }
    addLoadedBytesChangedEventListeners(handleLoadedBytesChanged)

    for (const url of urls) {
        const src = typeof url === "string" ? url : url.src

        const filetype = getExtensionType(src)
        if (!filetype) continue

        switch (filetype) {
            case "image":
                promises.push(loadTexturePromise(src))
                break

            case "model":
                const extension = getExtensionIncludingObjectURL(src)
                if (!extension || !["fbx", "glb", "gltf"].includes(extension))
                    break

                if (typeof url === "object")
                    promises.push(preloadModelPromise(url))
                else promises.push(preloadModelPromise({ src }))
            case "audio":
            case "plainText":
            case "scene":
                break

            default:
                assertExhaustive(filetype)
        }
    }

    await Promise.all(promises)

    removeLoadedBytesChangedEventListeners(handleLoadedBytesChanged)

    await new Promise<void>((resolve) => {
        getLoadingCount((count, handle) => {
            if (count > 0) return
            handle.cancel()
            resolve()
        })
    })
    onProgress?.(100)
}

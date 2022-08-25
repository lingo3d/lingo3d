import { getExtensionType } from "@lincode/filetypes"
import { assertExhaustive, splitFileName } from "@lincode/utils"
import {
    addLoadedBytesChangedEventListeners,
    removeLoadedBytesChangedEventListeners
} from "../display/utils/loaders/bytesLoaded"
import { lazyLoadFBX, lazyLoadGLTF } from "../display/utils/loaders/lazyLoad"
import loadTexturePromise from "../display/utils/loaders/loadTexturePromise"
import IModel from "../interface/IModel"
import { getLoadingCount } from "../states/useLoadingCount"

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
        else throw new Error("invalid preload total value: " + total)
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
                const extension = splitFileName(src)[1]?.toLowerCase()
                if (!extension || !["fbx", "glb", "gltf"].includes(extension))
                    break

                if (typeof url === "object") {
                    promises.push(
                        new Promise<void>(async (resolve) => {
                            const { default: Model } = await import(
                                "../display/Model"
                            )
                            const model = new Model(true)
                            Object.assign(model, url)
                            model.onLoad = resolve
                        })
                    )
                    break
                }
                promises.push(
                    extension === "fbx"
                        ? (await lazyLoadFBX()).default(src, false)
                        : (await lazyLoadGLTF()).default(src, false)
                )
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

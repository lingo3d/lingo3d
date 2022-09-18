import { getExtensionType } from "@lincode/filetypes"
import { assertExhaustive } from "@lincode/utils"
import {
    addLoadedBytesChangedEventListeners,
    removeLoadedBytesChangedEventListeners
} from "../display/utils/loaders/bytesLoaded"
import loadTexturePromise from "../display/utils/loaders/loadTexturePromise"
import { getLoadingCount } from "../states/useLoadingCount"

const preloadModelPromise = (src: string) =>
    new Promise<void>(async (resolve) => {
        const { default: Model } = await import("../display/Model")
        const model = new Model(true)
        model.src = src
        model.onLoad = resolve
    })

export default async (
    urls: Array<string>,
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

    for (const src of urls) {
        const filetype = getExtensionType(src)
        if (!filetype) continue

        switch (filetype) {
            case "image":
                promises.push(loadTexturePromise(src))
            case "model":
                promises.push(preloadModelPromise(src))
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

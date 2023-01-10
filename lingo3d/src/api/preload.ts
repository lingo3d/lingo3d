import { getExtensionType } from "@lincode/filetypes"
import {
    addLoadedBytesChangedEventListeners,
    removeLoadedBytesChangedEventListeners
} from "../display/utils/loaders/utils/bytesLoaded"
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
        if (filetype === "image") promises.push(loadTexturePromise(src))
        else if (filetype === "model") promises.push(preloadModelPromise(src))
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

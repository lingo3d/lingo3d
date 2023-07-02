import { getExtensionType } from "@lincode/filetypes"
import {
    addLoadedBytesChangedEventListeners,
    removeLoadedBytesChangedEventListeners
} from "../display/utils/loaders/utils/bytesLoaded"
import loadTexturePromise from "../display/utils/loaders/loadTexturePromise"
import loadModel from "../display/utils/loaders/loadModel"
import isBusy from "./isBusy"

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
        else if (filetype === "model") promises.push(loadModel(src, false))
    }

    await Promise.all(promises)

    removeLoadedBytesChangedEventListeners(handleLoadedBytesChanged)

    await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
            if (isBusy()) return
            clearInterval(interval)
            resolve()
        }, 100)
    })
    onProgress?.(100)
}

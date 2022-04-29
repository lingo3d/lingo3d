import { getExtensionType } from "@lincode/filetypes"
import { Cancellable } from "@lincode/promiselikes"
import { assertExhaustive, splitFileName } from "@lincode/utils"
import bytesLoaded from "../display/utils/loaders/bytesLoaded"
import { lazyLoadFBX, lazyLoadGLTF } from "../display/utils/loaders/lazyLoad"
import loadTexturePromise from "../display/utils/loaders/loadTexturePromise"
import { getLoadingCount } from "../states/useLoadingCount"

export default async (urls: Array<string>, total: number | string, onProgress?: (value: number) => void) => {
    const promises: Array<Promise<any>> = []

    for (const url of urls) {
        const filetype = getExtensionType(url)
        if (!filetype) continue

        switch (filetype) {
            case "image":
                promises.push(loadTexturePromise(url))
                break
            
            case "model":
                const extension = splitFileName(url)[1]?.toLowerCase()
                if (extension === "fbx")
                    promises.push((await lazyLoadFBX()).default(url, false))
                else if (extension === "gltf" || extension === "glb")
                    promises.push((await lazyLoadGLTF()).default(url, false))
                break
            
            case "audio":
            case "plainText":
            case "scene":
                break

            default:
                assertExhaustive(filetype)
        }
    }
    let totalBytes = 0
    if (typeof total === "number")
        totalBytes = total
    else {
        total = total.toLowerCase()
        if (total.endsWith("kb"))
            totalBytes = parseFloat(total) * 1024 * 1024
        else if (total.endsWith("mb"))
            totalBytes = parseFloat(total) * 1024 * 1024 * 1024
        else if (total.endsWith("gb"))
            totalBytes = parseFloat(total) * 1024 * 1024 * 1024 * 1024
        else
            throw new Error("invalid preload total value: " + total)
    }

    const interval = setInterval(() => {
        onProgress?.(totalBytes <= 0 ? 0 : Math.min(bytesLoaded[0] / totalBytes * 100, 99))
    }, 100)

    await Promise.all(promises)
    
    clearInterval(interval)

    await new Promise<void>(resolve => {
        const handle = new Cancellable()
        handle.watch(getLoadingCount(count => {
            if (count > 0) return
            handle.cancel()
            resolve() 
        }))
    })
    onProgress?.(100)
}
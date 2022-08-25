import { getExtensionType } from "@lincode/filetypes"
import { assertExhaustive, splitFileName } from "@lincode/utils"
import { BufferGeometry, Group } from "three"
import {
    addLoadedBytesChangedEventListeners,
    removeLoadedBytesChangedEventListeners
} from "../display/utils/loaders/bytesLoaded"
import { lazyLoadFBX, lazyLoadGLTF } from "../display/utils/loaders/lazyLoad"
import loadTexturePromise from "../display/utils/loaders/loadTexturePromise"
import { getLoadingCount } from "../states/useLoadingCount"

const computeMap = async (modelPromise: Promise<Group>, src: string) => {
    const [{ computeBVHFromGeometries }, loadedGroup] = await Promise.all([
        import("../display/core/PhysicsObjectManager/bvh/computeBVH"),
        modelPromise
    ])
    loadedGroup.updateMatrixWorld(true)

    const geometries: Array<BufferGeometry> = []
    loadedGroup.traverse((c: any) => {
        if (!c.geometry) return
        const geom = c.geometry.clone()
        geom.applyMatrix4(c.matrixWorld)
        geometries.push(geom)
        geom.dispose()
    })
    return computeBVHFromGeometries(geometries, src)
}

export default async (
    urls: Array<string | { physics: "map"; src: string }>,
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

                const modelPromise =
                    extension === "fbx"
                        ? (await lazyLoadFBX()).default(src, false)
                        : (await lazyLoadGLTF()).default(src, false)
                promises.push(modelPromise)
                if (typeof url === "object" && url.physics === "map")
                    promises.push(computeMap(modelPromise, src))

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

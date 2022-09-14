import { createEffect } from "@lincode/reactivity"
import { forceGet, splitFileName } from "@lincode/utils"
import dirPath from "../../../api/path/dirPath"
import isRelativePath from "../../../api/path/isRelativePath"
import joinPaths from "../../../api/path/joinPaths"
import { getFileCurrent } from "../../../states/useFileCurrent"
import { getFiles } from "../../../states/useFiles"
import setURLModifier from "../../utils/loaders/setURLModifier"

export const objectURLExtensionMap = new Map<string, string>()
export const fileObjectURLMap = new WeakMap<File, string>()
export const objectURLFileMap = new Map<string, File>()

export const getExtensionIncludingObjectURL = (src: string) =>
    objectURLExtensionMap.get(src) ?? splitFileName(src)[1]?.toLowerCase()

export const createObjectURL = (
    file: File,
    extension = splitFileName(file.webkitRelativePath)[1]?.toLowerCase()
) =>
    forceGet(fileObjectURLMap, file, () => {
        const url = URL.createObjectURL(file!)
        extension && objectURLExtensionMap.set(url, extension)
        objectURLFileMap.set(url, file)
        return url
    })

const pathFileMap = new Map<string, File>()

createEffect(() => {
    const files = getFiles()
    if (!files) return

    for (const file of files) pathFileMap.set(file.webkitRelativePath, file)
    return () => {
        pathFileMap.clear()
    }
}, [getFiles])

createEffect(() => {
    const urlCurrent = getFileCurrent()?.webkitRelativePath
    if (!urlCurrent) return

    setURLModifier((url) => {
        if (isRelativePath(url)) {
            const file = pathFileMap.get(joinPaths(dirPath(urlCurrent), url))
            if (file) return createObjectURL(file)
        }
        return url
    })
    return () => {
        setURLModifier(undefined)
    }
}, [getFileCurrent])

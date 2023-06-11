import { createEffect } from "@lincode/reactivity"
import { forceGet, splitFileName } from "@lincode/utils"
import dirPath from "../../../api/path/dirPath"
import isRelativePath from "../../../api/path/isRelativePath"
import joinPaths from "../../../api/path/joinPaths"
import { getFileCurrent } from "../../../states/useFileCurrent"
import { getFiles } from "../../../states/useFiles"
import setURLModifier from "../../utils/loaders/utils/setURLModifier"
import { webkitRelativePathFileMap } from "../../../collections/webkitRelativePathFileMap"

const objectURLExtensionMap = new Map<string, string>()
const fileObjectURLMap = new Map<File, string>()

export const getExtensionIncludingObjectURL = (src: string) =>
    objectURLExtensionMap.get(src) ?? splitFileName(src)[1]?.toLowerCase()

export const createObjectURL = (
    file: File,
    extension = splitFileName(file.webkitRelativePath)[1]?.toLowerCase()
) =>
    forceGet(fileObjectURLMap, file, () => {
        const url = URL.createObjectURL(file!)
        extension && objectURLExtensionMap.set(url, extension)
        return url
    })

createEffect(() => {
    const files = getFiles()
    if (!files) return

    for (const file of files) webkitRelativePathFileMap.set(file.webkitRelativePath, file)
    return () => {
        for (const objecURL of fileObjectURLMap.values())
            URL.revokeObjectURL(objecURL)

        webkitRelativePathFileMap.clear()
        objectURLExtensionMap.clear()
        fileObjectURLMap.clear()
    }
}, [getFiles])

createEffect(() => {
    const urlCurrent = getFileCurrent()?.webkitRelativePath
    if (!urlCurrent) return

    setURLModifier((url) => {
        if (isRelativePath(url)) {
            const file = webkitRelativePathFileMap.get(joinPaths(dirPath(urlCurrent), url))
            if (file) return createObjectURL(file)
        }
        return url
    })
    return () => {
        setURLModifier(undefined)
    }
}, [getFileCurrent])

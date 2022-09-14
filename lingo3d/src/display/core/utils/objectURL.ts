import { createEffect } from "@lincode/reactivity"
import { splitFileName } from "@lincode/utils"
import isRelativePath from "../../../api/path/isRelativePath"
import { getFileCurrent } from "../../../states/useFileCurrent"
import setURLModifier from "../../utils/loaders/setURLModifier"

export const objectURLExtensionMap = new Map<string, string>()
export const fileObjectURLMap = new WeakMap<File, string>()
export const objectURLFileMap = new Map<string, File>()

export const getExtensionIncludingObjectURL = (src: string) =>
    objectURLExtensionMap.get(src) ?? splitFileName(src)[1]?.toLowerCase()

createEffect(() => {
    const urlCurrent = getFileCurrent()?.webkitRelativePath
    if (!urlCurrent) return

    setURLModifier((url) => {
        if (isRelativePath(url)) {
            console.log(urlCurrent, url)

            // console.log(relativePath(urlCurrent, url))
        }

        return url
    })
    return () => {
        setURLModifier(undefined)
    }
}, [getFileCurrent])

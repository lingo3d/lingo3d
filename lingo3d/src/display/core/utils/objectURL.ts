import { createEffect } from "@lincode/reactivity"
import { splitFileName } from "@lincode/utils"
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
        if (url.startsWith("./")) {
            // URI(urlCurrent)
            // console.log(url)
            // console.log("/" + urlCurrent)
        }

        return url
    })
    return () => {
        setURLModifier(undefined)
    }
}, [getFileCurrent])

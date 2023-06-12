import store, { merge } from "@lincode/reactivity"
import { getFileBrowserDir } from "./useFileBrowserDir"
import { get } from "@lincode/utils"
import { pathDataMap } from "../collections/pathDataMap"

export interface FileStructure {
    [key: string]: FileStructure | File
}

export const [setFileStructure, getFileStructure] = store<FileStructure>({})
export const mergeFileStructure = merge(setFileStructure, getFileStructure)

const getOverlappingSubstring = (str1: string, str2: string) => {
    let overlap = 0
    let startIndex = 0
    for (let i = 0; i < str1.length; i++)
        for (let j = 0; j < str2.length; j++) {
            let k = 0
            while (
                i + k < str1.length &&
                j + k < str2.length &&
                str1[i + k] === str2[j + k]
            ) {
                k++
            }
            if (k > overlap) {
                overlap = k
                startIndex = i
            }
        }
    return str1.substring(startIndex, startIndex + overlap)
}

getFileBrowserDir((dir) => {
    if (pathDataMap.has(dir)) return

    const subFileStructure = get(getFileStructure(), dir.split("/"))
    if (!subFileStructure) {
        pathDataMap.set(dir, {})
        return
    }

    const files = Object.values(subFileStructure).filter(
        (f) => f instanceof File
    ) as Array<File>
    const imageFiles = files.filter((f) => f.type.includes("image"))
    if (imageFiles.length / files.length < 0.5) {
        pathDataMap.set(dir, {})
        return
    }

    let fileOld: File | undefined
    let fileNameOverlap: string | undefined
    for (const file of imageFiles) {
        if (fileOld) {
            const overlap = getOverlappingSubstring(file.name, fileOld.name)
            if (!overlap) {
                fileNameOverlap = overlap
                break
            }
        }
        fileOld = file
    }
    pathDataMap.set(dir, { fileNameOverlap })
})

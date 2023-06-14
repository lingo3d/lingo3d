import store, { merge } from "@lincode/reactivity"
import { getFileBrowserDir } from "./useFileBrowserDir"
import { get } from "@lincode/utils"
import { pathDirectoryDataMap } from "../collections/pathDirectoryDataMap"

export interface FileStructure {
    [key: string]: FileStructure | File
}

export const [setFileStructure, getFileStructure] = store<FileStructure>({})
export const mergeFileStructure = merge(setFileStructure, getFileStructure)

const getOverlappingSubstring = (str1: string, str2: string) => {
    let overlap = ""
    for (let i = 0; i < str1.length; ++i) {
        if (str1[i] !== str2[i]) break
        overlap += str1[i]
    }
    return overlap
}

getFileBrowserDir((dir) => {
    if (pathDirectoryDataMap.has(dir)) return

    const subFileStructure = get(getFileStructure(), dir.split("/"))
    if (!subFileStructure) {
        pathDirectoryDataMap.set(dir, {})
        return
    }

    const files = Object.values(subFileStructure).filter(
        (f) => f instanceof File
    ) as Array<File>
    const imageFiles = files.filter((f) => f.type.includes("image"))
    if (imageFiles.length / files.length < 0.5) {
        pathDirectoryDataMap.set(dir, {})
        return
    }

    let fileOld: File | undefined
    const fileNameOverlapRecord: Record<string, number> = {}
    for (const file of imageFiles) {
        if (fileOld) {
            const overlap = getOverlappingSubstring(file.name, fileOld.name)
            if (!overlap) continue
            fileNameOverlapRecord[overlap] ??= 0
            ++fileNameOverlapRecord[overlap]
            break
        }
        fileOld = file
    }
    const fileNameOverlap = Object.entries(fileNameOverlapRecord).sort(
        (a, b) => b[1] - a[1]
    )[0][0]
    pathDirectoryDataMap.set(dir, { fileNameOverlap, isMaterialFolder: true })
})

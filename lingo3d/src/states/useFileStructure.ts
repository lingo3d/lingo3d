import store, { merge } from "@lincode/reactivity"
import { set, traverse } from "@lincode/utils"
import { setFileBrowserDir } from "./useFileBrowserDir"
import { getFiles } from "./useFiles"

export const pathMap = new WeakMap<Record<string, any>, string>()
export const firstFolderNamePtr = [""]

export interface FileStructure {
    [key: string]: FileStructure | File
}

const [setFileStructure, getFileStructure] = store<FileStructure>({})
export { getFileStructure }

export const mergeFileStructure = merge(setFileStructure, getFileStructure)

export const setPathMap = (fileStructure: FileStructure) =>
    traverse(fileStructure, (key, child, parent) => {
        let path = ""
        if (pathMap.has(parent)) path = pathMap.get(parent) + "/" + key
        typeof child === "object" && pathMap.set(child, path)
    })

getFiles((files) => {
    const fileStructure: FileStructure = {}
    firstFolderNamePtr[0] = ""

    if (files) {
        for (const file of files)
            set(fileStructure, file.webkitRelativePath.split("/"), file)
        firstFolderNamePtr[0] = Object.keys(fileStructure)[0]
        setPathMap(fileStructure)
    }
    setFileBrowserDir(firstFolderNamePtr[0])
    setFileStructure(fileStructure)
})

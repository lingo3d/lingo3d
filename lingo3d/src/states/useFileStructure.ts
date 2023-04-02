import store, { merge } from "@lincode/reactivity"
import { set, traverse } from "@lincode/utils"
import { setFileBrowserDir } from "./useFileBrowserDir"
import { getFiles } from "./useFiles"
import { pathObjMap } from "../collections/pathCollections"
import { firstFolderNamePtr } from "../pointers/firstFolderNamePtr"

export interface FileStructure {
    [key: string]: FileStructure | File
}

export const [setFileStructure, getFileStructure] = store<FileStructure>({})
export const mergeFileStructure = merge(setFileStructure, getFileStructure)

export const setPathMap = (fileStructure: FileStructure) =>
    traverse(fileStructure, (key, child, parent) => {
        let path = ""
        if (pathObjMap.has(parent)) path = pathObjMap.get(parent) + "/" + key
        typeof child === "object" && pathObjMap.set(child, path)
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

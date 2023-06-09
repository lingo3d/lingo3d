import store, { merge } from "@lincode/reactivity"
import { set } from "@lincode/utils"
import { setFileBrowserDir } from "./useFileBrowserDir"
import { getFiles } from "./useFiles"
import { firstFolderNamePtr } from "../pointers/firstFolderNamePtr"
import { initPathObjMap } from "../collections/pathObjMap"

export interface FileStructure {
    [key: string]: FileStructure | File
}

export const [setFileStructure, getFileStructure] = store<FileStructure>({})
export const mergeFileStructure = merge(setFileStructure, getFileStructure)

getFiles((files) => {
    const fileStructure: FileStructure = {}
    firstFolderNamePtr[0] = ""

    if (files) {
        for (const file of files)
            set(fileStructure, file.webkitRelativePath.split("/"), file)
        firstFolderNamePtr[0] = Object.keys(fileStructure)[0]
        initPathObjMap(fileStructure)
    }
    setFileBrowserDir(firstFolderNamePtr[0])
    setFileStructure(fileStructure)
})

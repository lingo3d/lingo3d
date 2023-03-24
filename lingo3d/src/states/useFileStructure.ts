import store from "@lincode/reactivity"
import { set, traverse } from "@lincode/utils"
import { setFileBrowserDir } from "./useFileBrowserDir"
import { getFiles } from "./useFiles"

export const pathMap = new WeakMap<Record<string, any>, string>()
export const firstFolderNamePtr = [""]

interface FileStructure {
    [key: string]: FileStructure | File
}

export const [setFileStructure, getFileStructure] = store<FileStructure>({})

getFiles((files) => {
    const fileStructure: FileStructure = {}
    firstFolderNamePtr[0] = ""

    if (files) {
        for (const file of files)
            set(fileStructure, file.webkitRelativePath.split("/"), file)

        firstFolderNamePtr[0] = Object.keys(fileStructure)[0]

        traverse(fileStructure, (key, child, parent) => {
            let path = ""
            if (pathMap.has(parent)) path = pathMap.get(parent) + "/" + key
            typeof child === "object" && pathMap.set(child, path)
        })
    }
    setFileBrowserDir(firstFolderNamePtr[0])
    setFileStructure(fileStructure)
})

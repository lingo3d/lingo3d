import store from "@lincode/reactivity"
import { set, traverse } from "@lincode/utils"
import pathMap from "../editor/FileBrowser/pathMap"
import { setFileBrowserDir } from "./useFileBrowserDir"
import { getFiles } from "./useFiles"

interface FileStructure {
    [key: string]: FileStructure | File
}

export const [setFileStructure, getFileStructure] = store<{
    fileStructure: FileStructure
    firstFolderName: string
}>({
    fileStructure: {},
    firstFolderName: ""
})

getFiles((files) => {
    const fileStructure: FileStructure = {}
    let firstFolderName = ""

    if (files) {
        for (const file of files)
            set(fileStructure, file.webkitRelativePath.split("/"), file)

        firstFolderName = Object.keys(fileStructure)[0]

        traverse(fileStructure, (key, child, parent) => {
            let path = ""
            if (pathMap.has(parent)) path = pathMap.get(parent) + "/" + key
            typeof child === "object" && pathMap.set(child, path)
        })
    }
    setFileBrowserDir(firstFolderName)
    setFileStructure({ fileStructure, firstFolderName })
})

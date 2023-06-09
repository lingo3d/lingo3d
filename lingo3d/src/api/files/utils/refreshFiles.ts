import { set } from "@lincode/utils"
import { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import { pathFileMap, initPathObjMap } from "../../../collections/pathCollections"
import { FileStructure, mergeFileStructure } from "../../../states/useFileStructure"

export default (files: Array<FileWithDirectoryAndFileHandle>, file: File) => {
    files.push(file)
    pathFileMap.set(file.webkitRelativePath, file)

    const fileStructure: FileStructure = {}
    set(fileStructure, file.webkitRelativePath.split("/"), file)
    initPathObjMap(fileStructure)
    mergeFileStructure(fileStructure)
}

import { set } from "@lincode/utils"
import { pathFileMap } from "../../../collections/pathFileMap"
import {
    FileStructure,
    mergeFileStructure
} from "../../../states/useFileStructure"
import { initPathObjMap } from "../../../collections/pathObjMap"
import { getFiles } from "../../../states/useFiles"

export default (file: File) => {
    const files = getFiles()
    if (!files) return

    files.push(file)
    pathFileMap.set(file.webkitRelativePath, file)

    const fileStructure: FileStructure = {}
    set(fileStructure, file.webkitRelativePath.split("/"), file)
    initPathObjMap(fileStructure)
    mergeFileStructure(fileStructure)
}

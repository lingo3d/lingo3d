import { set } from "@lincode/utils"
import { pathFileMap } from "../../../collections/pathFileMap"
import {
    FileStructure,
    mergeFileStructure
} from "../../../states/useFileStructure"
import { setFileStructurePathMap } from "../../../collections/fileStructurePathMap"

export default (file: File) => {
    const fileStructure: FileStructure = {}
    set(fileStructure, file.webkitRelativePath.split("/"), file)
    pathFileMap.set(file.webkitRelativePath, file)
    setFileStructurePathMap(fileStructure)
    mergeFileStructure(fileStructure)
}

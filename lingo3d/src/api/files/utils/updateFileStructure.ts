import { set } from "@lincode/utils"
import { pathFileMap } from "../../../collections/pathFileMap"
import {
    FileStructure,
    mergeFileStructure
} from "../../../states/useFileStructure"
import { setFileStructurePathMap } from "../../../collections/fileStructurePathMap"

export default (file: File | Array<File>) => {
    const fileStructure: FileStructure = {}
    if (Array.isArray(file))
        for (const f of file) {
            set(fileStructure, f.webkitRelativePath.split("/"), f)
            pathFileMap.set(f.webkitRelativePath, f)
        }
    else {
        set(fileStructure, file.webkitRelativePath.split("/"), file)
        pathFileMap.set(file.webkitRelativePath, file)
    }
    setFileStructurePathMap(fileStructure)
    mergeFileStructure(fileStructure)
}

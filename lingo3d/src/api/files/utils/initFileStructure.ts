import { set } from "@lincode/utils"
import { initFileStructurePathMap } from "../../../collections/fileStructurePathMap"
import { pathFileMap } from "../../../collections/pathFileMap"
import { firstFolderNamePtr } from "../../../pointers/firstFolderNamePtr"
import { setFileBrowserDir } from "../../../states/useFileBrowserDir"
import {
    FileStructure,
    setFileStructure
} from "../../../states/useFileStructure"

export default (files: Array<File>) => {
    const fileStructure: FileStructure = {}
    for (const file of files) {
        set(fileStructure, file.webkitRelativePath.split("/"), file)
        pathFileMap.set(file.webkitRelativePath, file)
    }
    firstFolderNamePtr[0] = Object.keys(fileStructure)[0] ?? ""
    initFileStructurePathMap(fileStructure)
    setFileBrowserDir(firstFolderNamePtr[0])
    setFileStructure(fileStructure)
}

import { set } from "@lincode/utils"
import { webkitRelativePathFileMap } from "../../../collections/webkitRelativePathFileMap"
import {
    FileStructure,
    mergeFileStructure
} from "../../../states/useFileStructure"
import { initWebkitRelativePathObjMap } from "../../../collections/webkitRelativePathObjMap"
import { getFiles } from "../../../states/useFiles"

export default (file: File) => {
    const files = getFiles()
    if (!files) return

    files.push(file)
    webkitRelativePathFileMap.set(file.webkitRelativePath, file)

    const fileStructure: FileStructure = {}
    set(fileStructure, file.webkitRelativePath.split("/"), file)
    initWebkitRelativePathObjMap(fileStructure)
    mergeFileStructure(fileStructure)
}

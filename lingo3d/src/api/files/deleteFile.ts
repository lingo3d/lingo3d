import { getFileCurrent } from "../../states/useFileCurrent"
import { getFiles } from "../../states/useFiles"
import {
    getFileStructure,
    setFileStructure
} from "../../states/useFileStructure"
import { pull, unset } from "@lincode/utils"
import { pathFileMap } from "../../display/core/utils/objectURL"
import { getFileSelected } from "../../states/useFileSelected"
import unsafeGetValue from "../../utils/unsafeGetValue"
import { unloadFile } from "./loadFile"

export default async () => {
    const file = getFileSelected()
    const files = getFiles()
    if (!file || !files) return

    const handle = unsafeGetValue(file, "handle")
    handle.remove()

    pull(files, file)
    pathFileMap.delete(file.webkitRelativePath)

    const fileStructure = getFileStructure()
    unset(fileStructure, file.webkitRelativePath.split("/"))
    setFileStructure({ ...fileStructure })

    file === getFileCurrent() && unloadFile()
}

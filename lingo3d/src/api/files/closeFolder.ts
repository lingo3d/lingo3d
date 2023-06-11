import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"
import { pathFileMap } from "../../collections/pathFileMap"
import { setFileBrowserDir } from "../../states/useFileBrowserDir"
import { setFileCurrent } from "../../states/useFileCurrent"
import { setFileStructure } from "../../states/useFileStructure"
import { unloadFile } from "./unloadFile"

export default () => {
    pathDirectoryHandleMap.clear()
    pathFileMap.clear()
    setFileStructure({})
    setFileBrowserDir("")

    unloadFile()
    setFileCurrent(undefined)
}

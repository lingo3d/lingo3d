import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"
import { pathFileMap } from "../../collections/pathFileMap"
import { rootFolderNamePtr } from "../../pointers/rootFolderNamePtr"
import { setFileBrowserDir } from "../../states/useFileBrowserDir"
import { setFileCurrent } from "../../states/useFileCurrent"
import { setFileStructure } from "../../states/useFileStructure"
import { unloadFile } from "./unloadFile"

export default () => {
    pathDirectoryHandleMap.clear()
    pathFileMap.clear()
    rootFolderNamePtr[0] = ""
    setFileStructure({})
    setFileBrowserDir("")

    unloadFile()
    setFileCurrent(undefined)
}

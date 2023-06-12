import { pathDirectoryDataMap } from "../../collections/pathDirectoryDataMap"
import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"
import { pathFileMap } from "../../collections/pathFileMap"
import { pathObjectURLMap } from "../../collections/pathObjectURLMap"
import setURLModifier from "../../display/utils/loaders/utils/setURLModifier"
import { setFileBrowserDir } from "../../states/useFileBrowserDir"
import { setFileStructure } from "../../states/useFileStructure"
import { unloadFile } from "./unloadFile"

export default () => {
    pathDirectoryHandleMap.clear()
    pathDirectoryDataMap.clear()
    pathFileMap.clear()
    pathObjectURLMap.clear()
    setFileStructure({})
    setFileBrowserDir("")
    setURLModifier(undefined)
    unloadFile()
}

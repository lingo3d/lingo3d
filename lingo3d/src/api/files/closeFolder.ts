import setURLModifier from "../../display/utils/loaders/utils/setURLModifier"
import { setFileBrowserDir } from "../../states/useFileBrowserDir"
import { setFileStructure } from "../../states/useFileStructure"
import { unloadFile } from "./unloadFile"

export default () => {
    setFileStructure({})
    setFileBrowserDir("")
    setURLModifier(undefined)
    unloadFile()
}

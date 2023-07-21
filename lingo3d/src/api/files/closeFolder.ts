import setURLModifier from "../../display/utils/loaders/utils/setURLModifier"
import { setFileBrowserDir } from "../../states/useFileBrowserDir"
import { setFileCurrent } from "../../states/useFileCurrent"
import { setFileStructure } from "../../states/useFileStructure"

export default () => {
    setFileStructure({})
    setFileBrowserDir("")
    setFileCurrent(undefined)
    setURLModifier(undefined)
}

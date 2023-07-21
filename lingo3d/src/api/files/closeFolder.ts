import setURLModifier from "../../display/utils/loaders/utils/setURLModifier"
import { emitUnload } from "../../events/onUnload"
import { setFileBrowserDir } from "../../states/useFileBrowserDir"
import { setFileStructure } from "../../states/useFileStructure"

export default () => {
    setFileStructure({})
    setFileBrowserDir("")
    setURLModifier(undefined)
    emitUnload()
}

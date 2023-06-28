import Appendable from "../../display/core/Appendable"
import { handleStopPropagation } from "../../engine/hotkeys"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { setWorldMode } from "../../states/useWorldMode"
import { toggleRightClick } from "../../engine/mouse"

export default (e: MouseEvent, target?: Appendable, rightClick?: boolean) => {
    handleStopPropagation(e)
    setWorldMode("editor")
    rightClick && toggleRightClick(e.clientX, e.clientY)
    emitSelectionTarget(target, true)
}

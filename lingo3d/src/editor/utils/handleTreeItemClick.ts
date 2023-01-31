import { Object3D } from "three"
import Appendable from "../../api/core/Appendable"
import { toggleRightClickPtr } from "../../api/mouse"
import { isPositionedManager } from "../../display/core/PositionedManager"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { setSelectionNativeTarget } from "../../states/useSelectionNativeTarget"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { setWorldPlay } from "../../states/useWorldPlay"

export default (
    target?: Appendable | Object3D,
    rightClick?: boolean,
    parent?: Appendable
) => {
    setWorldPlay(false)
    queueMicrotask(() => {
        rightClick && toggleRightClickPtr()
        if (isPositionedManager(parent) && getSelectionTarget() !== parent)
            emitSelectionTarget(parent, true)
        if (target instanceof Object3D) setSelectionNativeTarget(target)
        else emitSelectionTarget(target, true)
    })
}

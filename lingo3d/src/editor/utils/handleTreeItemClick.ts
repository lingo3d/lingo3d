import { Object3D } from "three"
import Appendable from "../../api/core/Appendable"
import { isPositionedItem } from "../../api/core/PositionedItem"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { setEditorMode } from "../../states/useEditorMode"
import { getEditorPlay } from "../../states/useEditorPlay"
import { setSelectionNativeTarget } from "../../states/useSelectionNativeTarget"
import { getSelectionTarget } from "../../states/useSelectionTarget"

export default (
    target?: Appendable | Object3D,
    rightClick?: boolean,
    parent?: Appendable
) => {
    getEditorPlay() && setEditorMode("translate")
    queueMicrotask(() => {
        if (isPositionedItem(parent) && getSelectionTarget() !== parent)
            emitSelectionTarget(parent, rightClick, true)
        if (target instanceof Object3D)
            queueMicrotask(() => setSelectionNativeTarget(target))
        else emitSelectionTarget(target, rightClick, true)
    })
}

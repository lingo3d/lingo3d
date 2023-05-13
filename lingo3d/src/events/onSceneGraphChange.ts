import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import { getEditorMode } from "../states/useEditorMode"
import Appendable from "../api/core/Appendable"
import diffSceneGraph from "../throttle/diffSceneGraph"
import throttleFrameTrailing from "../throttle/utils/throttleFrameTrailing"

const [_emitSceneGraphChange, onSceneGraphChange] = event<Appendable>()
export { onSceneGraphChange }

export const emitSceneGraphChange = throttleFrameTrailing(_emitSceneGraphChange)

createEffect(() => {
    if (!getEditorMode()) return
    const handle = onSceneGraphChange(() => diffSceneGraph())
    return () => {
        handle.cancel
    }
}, [getEditorMode])

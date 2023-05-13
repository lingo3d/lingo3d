import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import { getEditorMode } from "../states/useEditorMode"
import Appendable from "../api/core/Appendable"
import { throttleTrailing } from "@lincode/utils"
import diffSceneGraph from "../throttle/diffSceneGraph"

const [_emitSceneGraphChange, onSceneGraphChange] = event<Appendable>()
export { onSceneGraphChange }

export const emitSceneGraphChange = throttleTrailing(_emitSceneGraphChange)

createEffect(() => {
    if (!getEditorMode()) return
    const handle = onSceneGraphChange(() => diffSceneGraph())
    return () => {
        handle.cancel
    }
}, [getEditorMode])

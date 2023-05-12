import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import { throttleTrailing } from "@lincode/utils"
import { getEditorMode } from "../states/useEditorMode"
import diffSceneGraph from "../api/undoStack/diffSceneGraph"

const [_emitSceneGraphChange, onSceneGraphChange] = event()
export { onSceneGraphChange }

export const emitSceneGraphChange = throttleTrailing(_emitSceneGraphChange)

createEffect(() => {
    if (!getEditorMode()) return
    const handle = onSceneGraphChange(() => diffSceneGraph())
    return () => {
        handle.cancel
    }
}, [getEditorMode])

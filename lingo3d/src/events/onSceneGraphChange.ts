import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import { getEditorMode } from "../states/useEditorMode"
import Appendable from "../api/core/Appendable"

export const [emitSceneGraphChange, onSceneGraphChange] = event<Appendable>()

createEffect(() => {
    if (!getEditorMode()) return
    const handle = onSceneGraphChange((manager) => {
        console.log(manager)
    })
    return () => {
        handle.cancel
    }
}, [getEditorMode])

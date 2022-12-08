import { createEffect, store } from "@lincode/reactivity"
import { onEditorEdit } from "../events/onEditorEdit"
import { onTransformControls } from "../events/onTransformControls"
import { getEditorMounted } from "./useEditorMounted"

const [setEditorUndoStack, getEditorUndoStack] = store<Array<any>>([])

createEffect(() => {
    if (!getEditorMounted()) return

    const handle0 = onTransformControls((val) => {
        if (val !== "stop") return
    })
    const handle1 = onEditorEdit((val) => {
        if (val !== "stop") return
    })
    return () => {
        handle0.cancel()
        handle1.cancel()
    }
}, [getEditorMounted])

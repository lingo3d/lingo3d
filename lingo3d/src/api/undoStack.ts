import { createEffect } from "@lincode/reactivity"
import { Changes, onEditorTrackChanges } from "../events/onEditorTrackChanges"
import unsafeSetValue from "../utils/unsafeSetValue"
import { getEditorMounted } from "../states/useEditorMounted"

let index = 0
const undoStack: Array<Changes> = []

createEffect(() => {
    if (!getEditorMounted()) return

    const handle = onEditorTrackChanges((changes) => {
        undoStack.length = index
        undoStack.push(changes)
        index = undoStack.length
    })
    return () => {
        handle.cancel()
    }
}, [getEditorMounted])

export const undo = () => {
    if (--index < 0) {
        index = 0
        return
    }
    for (const changes of undoStack[index]) {
        const [instance, changedProperties] = changes
        for (const [property, saved] of changedProperties)
            unsafeSetValue(instance, property, saved)
    }
}

export const redo = () => {
    if (++index >= undoStack.length) {
        index = undoStack.length
        return
    }
    for (const changes of undoStack[index]) {
        const [instance, changedProperties] = changes
        for (const [property, saved] of changedProperties)
            unsafeSetValue(instance, property, saved)
    }
}

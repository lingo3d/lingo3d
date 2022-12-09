import { createEffect } from "@lincode/reactivity"
import { Changes, onEditorChanges } from "../events/onEditorChanges"
import unsafeSetValue from "../utils/unsafeSetValue"
import { getEditorMounted } from "../states/useEditorMounted"
import { setTimeline } from "../states/useTimeline"
import { AnimationData } from "../interface/IAnimationManager"

let index = 0
const undoStack: Array<Changes> = []
let timelineDataRedoStack: Array<AnimationData> = []

createEffect(() => {
    if (!getEditorMounted()) return

    const handle = onEditorChanges((changes) => {
        timelineDataRedoStack = []
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
        const [instance, changedProperties, timeline, timelineDataSnapshot] =
            changes

        setTimeline(timeline)
        timelineDataRedoStack.push(structuredClone(timeline?.data))
        if (timeline) timeline.data = timelineDataSnapshot

        for (const [property, saved] of changedProperties)
            unsafeSetValue(instance, property, saved)
    }
}

export const redo = () => {
    if (++index > undoStack.length) index = undoStack.length
    for (const changes of undoStack[index - 1]) {
        const [instance, changedProperties, timeline] = changes

        setTimeline(timeline)
        const timelineDataSnapshot = timelineDataRedoStack.pop()
        if (timeline) timeline.data = timelineDataSnapshot

        for (const [property, , saved] of changedProperties)
            unsafeSetValue(instance, property, saved)
    }
}

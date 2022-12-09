import { createEffect } from "@lincode/reactivity"
import { Changes, onEditorTrackChanges } from "../events/onEditorTrackChanges"
import unsafeSetValue from "../utils/unsafeSetValue"
import { getEditorMounted } from "../states/useEditorMounted"
import { setTimeline } from "../states/useTimeline"
import diffObjects from "../utils/diffObjects"
import { set, unset } from "@lincode/utils"

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
        const [
            instance,
            changedProperties,
            frame,
            timeline,
            timelineDataSnapshot
        ] = changes
        setTimeline(timeline)

        const timelineData = timeline?.data
        if (timelineDataSnapshot && timelineData) {
            const { changes, deletes } = diffObjects(
                timelineData,
                timelineDataSnapshot
            )
            for (const [path, value] of changes) set(timelineData, path, value)
            for (const path of deletes) unset(timelineData, path)
            timeline.data = timelineData
        }
        for (const [property, saved] of changedProperties)
            unsafeSetValue(instance, property, saved)
    }
}

export const redo = () => {
    if (++index > undoStack.length) index = undoStack.length
    for (const changes of undoStack[index - 1]) {
        const [instance, changedProperties, frame, timeline] = changes
        setTimeline(timeline)
        for (const [property, , saved] of changedProperties)
            unsafeSetValue(instance, property, saved)
    }
}

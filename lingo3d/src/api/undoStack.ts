import { createEffect } from "@lincode/reactivity"
import { Changes, onEditorChanges } from "../events/onEditorChanges"
import unsafeSetValue from "../utils/unsafeSetValue"
import { getEditorMounted } from "../states/useEditorMounted"
import { getTimeline } from "../states/useTimeline"
import { AnimationData } from "../interface/IAnimationManager"

let index = 0
const undoStack: Array<Changes> = []
let timelineDataRedoStack: Array<AnimationData> = []
const changesTimelineDataSnapshotMap = new WeakMap<Changes, AnimationData>()

createEffect(() => {
    if (!getEditorMounted()) return

    let timelineOpenIndex = 0
    const handle0 = getTimeline((timeline) => {
        if (timeline) timelineOpenIndex = index
        else index = timelineOpenIndex
        undoStack.length = index
        timelineDataRedoStack = []
    })

    const handle1 = onEditorChanges((changes) => {
        timelineDataRedoStack = []
        changesTimelineDataSnapshotMap.set(
            changes,
            structuredClone(getTimeline()?.data)
        )
        undoStack.length = index
        undoStack.push(changes)
        index = undoStack.length
    })
    return () => {
        handle0.cancel()
        handle1.cancel()
    }
}, [getEditorMounted])

export const undo = () => {
    if (--index < 0) {
        index = 0
        return
    }
    const timeline = getTimeline()
    timelineDataRedoStack.push(structuredClone(timeline?.data))
    const changes = undoStack[index]
    if (timeline) timeline.data = changesTimelineDataSnapshotMap.get(changes)

    for (const [instance, changedProperties] of changes)
        for (const [property, saved] of changedProperties)
            unsafeSetValue(instance, property, saved)
}

export const redo = () => {
    if (++index > undoStack.length) {
        index = undoStack.length
        return
    }
    const timeline = getTimeline()
    if (timeline && timelineDataRedoStack.length)
        timeline.data = timelineDataRedoStack.pop()

    for (const [instance, changedProperties] of undoStack[index - 1])
        for (const [property, , saved] of changedProperties)
            unsafeSetValue(instance, property, saved)
}

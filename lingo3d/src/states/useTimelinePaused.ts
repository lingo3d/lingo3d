import store, { createEffect } from "@lincode/reactivity"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import {
    addSyncFrameSystem,
    deleteSyncFrameSystem
} from "../systems/syncFrameSystem"
import { getTimeline } from "./useTimeline"

const [setTimelinePaused, getTimelinePaused] = store(true)
export { getTimelinePaused }

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return

    const handle = timeline.pausedState.get(setTimelinePaused)
    return () => {
        handle.cancel()
        setTimelinePaused(true)
    }
}, [getTimeline])

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline || getTimelinePaused()) return

    emitSelectionTarget(undefined)

    addSyncFrameSystem(timeline)
    return () => {
        deleteSyncFrameSystem(timeline)
    }
}, [getTimeline, getTimelinePaused])

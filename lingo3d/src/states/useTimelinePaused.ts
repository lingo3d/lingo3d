import store, { createEffect } from "@lincode/reactivity"
import Timeline from "../display/Timeline"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import renderSystem from "../utils/renderSystem"
import { getTimeline } from "./useTimeline"
import { setTimelineFrame } from "./useTimelineFrame"

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

const [addSyncFrameSystem, deleteSyncFrameSystem] = renderSystem(
    (timeline: Timeline) => {
        let { frame, totalFrames } = timeline
        if (frame >= totalFrames) {
            frame = timeline.frame = totalFrames
            timeline.paused = true
        }
        setTimelineFrame(frame)
    }
)

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline || getTimelinePaused()) return

    emitSelectionTarget(undefined)

    addSyncFrameSystem(timeline)
    return () => {
        deleteSyncFrameSystem(timeline)
    }
}, [getTimeline, getTimelinePaused])

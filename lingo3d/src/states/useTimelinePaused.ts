import store, { createEffect } from "@lincode/reactivity"
import { onBeforeRender } from "../events/onBeforeRender"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import getPrivateValue from "../utils/getPrivateValue"
import { getTimeline } from "./useTimeline"
import { setTimelineFrame } from "./useTimelineFrame"

const [setTimelinePaused, getTimelinePaused] = store(true)
export { getTimelinePaused }

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return

    const handle = getPrivateValue(timeline, "pausedState").get(
        setTimelinePaused
    )
    return () => {
        handle.cancel()
        setTimelinePaused(true)
    }
}, [getTimeline])

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline || getTimelinePaused()) return

    emitSelectionTarget(undefined)

    const handle = onBeforeRender(() => {
        let { frame, totalFrames } = timeline
        if (frame >= totalFrames) {
            frame = timeline.frame = totalFrames
            timeline.paused = true
        }
        setTimelineFrame(frame)
    })
    return () => {
        handle.cancel()
    }
}, [getTimeline, getTimelinePaused])

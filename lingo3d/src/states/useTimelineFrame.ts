import store from "@lincode/reactivity"
import Timeline from "../display/Timeline"
import { emitTimelineHighlightFrame } from "../events/onTimelineHighlightFrame"
import { emitTimelineSeekScrollLeft } from "../events/onTimelineSeekScrollLeft"
import { getTimeline } from "./useTimeline"
import { timelinePtr } from "../pointers/timelinePtr"
import { timelineFramePtr } from "../pointers/timelineFramePtr"

export const [setTimelineFrame, getTimelineFrame] = store(-1)

getTimelineFrame((val) => (timelineFramePtr[0] = val))

export const userSetTimelineFrame = (
    frame: number | ((timeline: Timeline) => number)
) => {
    const [timeline] = timelinePtr
    if (!timeline) return

    setTimelineFrame(
        (timeline.frame = typeof frame === "function" ? frame(timeline) : frame)
    )
    timeline.paused = true
    emitTimelineHighlightFrame(undefined)
    emitTimelineSeekScrollLeft()
}

export const increaseTimelineFrame = () =>
    userSetTimelineFrame(timelineFramePtr[0] + 1)

export const decreaseTimelineFrame = () =>
    userSetTimelineFrame(Math.max(timelineFramePtr[0] - 1, 0))

export const firstTimelineFrame = () => userSetTimelineFrame(0)

export const lastTimelineFrame = () =>
    userSetTimelineFrame((timeline) => timeline.clipTotalFrames)

getTimeline((timeline) => userSetTimelineFrame(timeline ? 0 : -1))

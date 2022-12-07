import store from "@lincode/reactivity"
import { deselectFrameIndicator } from "../editor/TimelineEditor/FrameIndicator"
import { emitTimelineSeekScrollLeft } from "../events/onTimelineSeekScrollLeft"
import { getTimeline } from "./useTimeline"

export const [setTimelineFrame, getTimelineFrame] = store(0)

export const increaseTimelineFrame = () => {
    const timeline = getTimeline()
    if (!timeline) return
    setTimelineFrame((timeline.frame = getTimelineFrame() + 1))
    deselectFrameIndicator()
    emitTimelineSeekScrollLeft()
}

export const decreaseTimelineFrame = () => {
    const timeline = getTimeline()
    if (!timeline) return
    setTimelineFrame((timeline.frame = Math.max(getTimelineFrame() - 1, 0)))
    deselectFrameIndicator()
    emitTimelineSeekScrollLeft()
}

export const firstTimelineFrame = () => {
    const timeline = getTimeline()
    if (!timeline) return
    setTimelineFrame((timeline.frame = 0))
    deselectFrameIndicator()
    emitTimelineSeekScrollLeft()
}

export const lastTimelineFrame = () => {
    const timeline = getTimeline()
    if (!timeline) return
    setTimelineFrame((timeline.frame = timeline.clipTotalFrames))
    deselectFrameIndicator()
    emitTimelineSeekScrollLeft()
}

getTimeline((timeline) => !timeline && setTimelineFrame(0))

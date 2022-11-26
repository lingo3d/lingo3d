import preactStore from "../utils/preactStore"
import { getTimeline } from "./useTimeline"

export const [useTimelineFrame, setTimelineFrame, getTimelineFrame] =
    preactStore(0)

export const increaseTimelineFrame = () => {
    const timeline = getTimeline()
    timeline && setTimelineFrame((timeline.frame = getTimelineFrame() + 1))
}

export const decreaseTimelineFrame = () => {
    const timeline = getTimeline()
    timeline &&
        setTimelineFrame((timeline.frame = Math.max(getTimelineFrame() - 1, 0)))
}

export const firstTimelineFrame = () => {
    const timeline = getTimeline()
    timeline && setTimelineFrame((timeline.frame = 0))
}

export const lastTimelineFrame = () => {
    const timeline = getTimeline()
    timeline && setTimelineFrame((timeline.frame = timeline.totalFrames))
}

getTimeline((timeline) => !timeline && setTimelineFrame(0))

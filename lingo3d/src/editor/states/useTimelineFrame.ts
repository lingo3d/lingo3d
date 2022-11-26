import preactStore from "../utils/preactStore"
import { getTimeline } from "./useTimeline"

export const [useTimelineFrame, setTimelineFrame, getTimelineFrame] =
    preactStore(0)

export const increaseTimelineFrame = () =>
    setTimelineFrame(getTimelineFrame() + 1)

export const decreaseTimelineFrame = () =>
    setTimelineFrame(Math.max(getTimelineFrame() - 1, 0))

export const firstTimelineFrame = () => setTimelineFrame(0)

export const lastTimelineFrame = () => {
    const timeline = getTimeline()
    timeline && setTimelineFrame(timeline.totalFrames)
}

getTimeline((timeline) => !timeline && setTimelineFrame(0))

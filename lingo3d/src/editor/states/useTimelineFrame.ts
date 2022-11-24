import preactStore from "../utils/preactStore"
import { getTimeline } from "./useTimeline"

export const [useTimelineFrame, setTimelineFrame, getTimelineFrame] =
    preactStore(0)

export const increaseTimelineFrame = () =>
    setTimelineFrame(
        Math.min(getTimelineFrame() + 1, getTimeline()?.totalFrames ?? 0)
    )

export const decreaseTimelineFrame = () =>
    setTimelineFrame(Math.max(getTimelineFrame() - 1, 0))

getTimeline((timeline) => !timeline && setTimelineFrame(0))

import { event } from "@lincode/events"
import { timelinePtr } from "../pointers/timelinePtr"
import { getTimeline } from "../states/useTimeline"
import { setTimelineFrame } from "../states/useTimelineFrame"
import { emitTimelineHighlightFrame } from "./onTimelineHighlightFrame"
import { emitTimelineSeekScrollLeft } from "./onTimelineSeekScrollLeft"

export const [emitTimelineFrame, onTimelineFrame] = event<number>()

onTimelineFrame((frame) => {
    const [timeline] = timelinePtr
    if (!timeline) return

    setTimelineFrame((timeline.frame = frame))
    timeline.paused = true
    emitTimelineHighlightFrame(undefined)
    emitTimelineSeekScrollLeft()
})

getTimeline((timeline) => emitTimelineFrame(timeline ? 0 : -1))

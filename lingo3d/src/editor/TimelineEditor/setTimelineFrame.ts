import { emitTimelineHighlightFrame } from "../../events/onTimelineHighlightFrame"
import { timelineFramePtr } from "../../pointers/timelineFramePtr"
import { timelinePtr } from "../../pointers/timelinePtr"
import { PointType } from "../../utils/isPoint"
import { timelineScrollerSeek } from "./timelineScrollerSeek"

export const setTimelineFrame = (
    frame: number,
    highlightFrame?: PointType
) => {
    const [timeline] = timelinePtr
    if (!timeline) return
    timeline.frame = timelineFramePtr[0] = frame
    timeline.paused = true
    emitTimelineHighlightFrame(highlightFrame)
    timelineScrollerSeek()
}

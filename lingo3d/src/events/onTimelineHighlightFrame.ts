import { event } from "@lincode/events"
import { Point } from "@lincode/math"

export const [emitTimelineHighlightFrame, onTimelineHighlightFrame] = event<
    Point | undefined
>()

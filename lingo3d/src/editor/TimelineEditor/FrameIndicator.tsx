import { Point } from "@lincode/math"
import { signal } from "@preact/signals"
import { memo } from "preact/compat"
import { FRAME_HEIGHT, FRAME_WIDTH } from "../../globals"
import { getTimeline } from "../../states/useTimeline"
import { getTimelineLayer } from "../../states/useTimelineLayer"

export const deselectFrameIndicator = () => {
    const timeline = getTimeline()
    if (!timeline) return
    timeline.paused = true
    frameIndicatorSignal.value = undefined
}

export const frameIndicatorSignal = signal<Point | undefined>(undefined)
getTimelineLayer(deselectFrameIndicator)

const FrameIndicator = () => {
    const pt = frameIndicatorSignal.value
    if (!pt) return null

    return (
        <div
            style={{
                position: "absolute",
                pointerEvents: "none",
                width: FRAME_WIDTH,
                height: FRAME_HEIGHT,
                background: "rgba(255, 255, 255, 0.1)",
                left: pt.x,
                top: pt.y
            }}
        />
    )
}

export default memo(FrameIndicator, () => true)

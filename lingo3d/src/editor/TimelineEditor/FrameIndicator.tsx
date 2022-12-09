import { Point } from "@lincode/math"
import { signal } from "@preact/signals"
import { memo } from "preact/compat"
import { FRAME_HEIGHT, FRAME_WIDTH } from "../../globals"
import { getTimelineLayer } from "../../states/useTimelineLayer"

export const highlightFrame = (pt?: Point) => {
    if (pt) {
        setTimeout(() => (frameIndicatorSignal.value = pt))
        return
    }
    frameIndicatorSignal.value = undefined
}

const frameIndicatorSignal = signal<Point | undefined>(undefined)
getTimelineLayer(() => highlightFrame())

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

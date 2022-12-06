import { Point } from "@lincode/math"
import { signal } from "@preact/signals"
import { memo } from "preact/compat"
import { FRAME_HEIGHT, FRAME_WIDTH } from "../../globals"
import { getTimelineLayer } from "../../states/useTimelineLayer"

export const frameIndicatorSignal = signal<Point | undefined>(undefined)
getTimelineLayer((layer) => !layer && (frameIndicatorSignal.value = undefined))

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
        ></div>
    )
}

export default memo(FrameIndicator, () => true)

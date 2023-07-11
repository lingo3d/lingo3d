import { memo } from "preact/compat"
import { FRAME_HEIGHT, FRAME_WIDTH } from "../../globals"
import { frameIndicatorSignal } from "./frameIndicatorSignal"
import { returnTrue } from "../../display/utils/reusables"

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

export default memo(FrameIndicator, returnTrue)

import { CSSProperties, memo, useState } from "preact/compat"
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"
import { getTimeline } from "../states/useTimeline"
import { setTimelineContextMenu } from "../states/useTimelineContextMenu"
import { getTimelineFrame, setTimelineFrame } from "../states/useTimelineFrame"
import { getTimelineLayer, setTimelineLayer } from "../states/useTimelineLayer"
import diffProps from "../utils/diffProps"

let prevSetSelected: ((val: boolean) => void) | undefined
const deselect = () => {
    if (!prevSetSelected) return
    prevSetSelected(false)
    prevSetSelected = undefined
}
getTimelineFrame(deselect)
getTimelineLayer(deselect)

type FrameProps = {
    style: CSSProperties
    keyframe: boolean
    layer: string
    index: number
}

const Frame = ({ style, keyframe, layer, index }: FrameProps) => {
    const [selected, setSelected] = useState(false)

    const handleMouseDown = () => {
        const timeline = getTimeline()
        if (!timeline) return

        setTimelineLayer(layer)
        setTimelineFrame(index)

        timeline.paused = true
        timeline.frame = index

        setSelected(true)
        prevSetSelected = setSelected
    }

    return (
        <div
            className="lingo3d-flexcenter"
            style={{
                ...style,
                width: FRAME_WIDTH,
                height: FRAME_HEIGHT,
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderLeft: "none",
                background: keyframe ? "rgba(255 ,255, 255, 0.1)" : undefined
            }}
            onMouseDown={handleMouseDown}
            onContextMenu={(e) => {
                e.preventDefault()
                setTimelineContextMenu({ x: e.clientX, y: e.clientY, keyframe })
                handleMouseDown()
            }}
        >
            {keyframe && (
                <div
                    style={{
                        width: 4,
                        height: 4,
                        background: "rgba(255, 255, 255, 0.2)"
                    }}
                />
            )}
            {selected && (
                <div
                    className="lingo3d-absfull"
                    style={{ background: "white", opacity: 0.1 }}
                />
            )}
        </div>
    )
}

export default memo(Frame, diffProps)

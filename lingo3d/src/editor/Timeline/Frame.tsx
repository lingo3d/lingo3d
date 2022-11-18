import { CSSProperties } from "preact/compat"
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"
import { setITmelineSelectedFrame, setTimelineSelectedLayer } from "../states"

type FrameProps = {
    style: CSSProperties
    keyframe: boolean
    layer: string
    index: number
}

const Frame = ({ style, keyframe, layer, index }: FrameProps) => {
    return (
        <div
            className="lingo3d-flexcenter"
            style={{
                ...style,
                width: FRAME_WIDTH,
                height: FRAME_HEIGHT - 4,
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderLeft: "none",
                background: keyframe ? "rgba(255 ,255, 255, 0.1)" : undefined
            }}
            onClick={() => {
                setTimelineSelectedLayer(layer)
                setITmelineSelectedFrame(index)
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
        </div>
    )
}

export default Frame

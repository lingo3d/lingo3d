import { CSSProperties } from "preact/compat"
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"
import { useTimelineSelectedFrame, useTimelineSelectedLayer } from "../states"

type FrameProps = {
    style: CSSProperties
    keyframe: boolean
    layer: string
    index: number
}

const Frame = ({ style, keyframe, layer, index }: FrameProps) => {
    const [selectedFrame, setSelectedFrame] = useTimelineSelectedFrame()
    const [selectedLayer, setSelectedLayer] = useTimelineSelectedLayer()
    const selected = selectedFrame === index && selectedLayer === layer

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
            onClick={() => {
                setSelectedLayer(layer)
                setSelectedFrame(index)
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
                    style={{ background: "blue", opacity: 0.25 }}
                />
            )}
        </div>
    )
}

export default Frame

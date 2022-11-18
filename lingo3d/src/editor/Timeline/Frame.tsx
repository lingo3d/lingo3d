import { CSSProperties } from "preact/compat"
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"

type FrameProps = {
    style?: CSSProperties
    keyframe?: boolean
}

const Frame = ({ style, keyframe }: FrameProps) => {
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

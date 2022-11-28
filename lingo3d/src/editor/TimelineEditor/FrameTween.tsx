import { memo } from "preact/compat"
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"

type FrameTweenProps = {
    frameNum: number
    frameNums: Array<number>
    index: number
}

const FrameTween = ({ frameNum, frameNums, index }: FrameTweenProps) => {
    return (
        <div
            style={{
                width:
                    Math.max((frameNums[index + 1] ?? frameNum) - frameNum, 1) *
                    FRAME_WIDTH,
                height: FRAME_HEIGHT,
                position: "absolute",
                left: frameNum * FRAME_WIDTH,
                opacity: 0.5
            }}
        />
    )
}

export default memo(
    FrameTween,
    (prev, next) => prev.frameNums === next.frameNums
)

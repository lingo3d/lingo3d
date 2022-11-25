import { memo } from "preact/compat"
import { useMemo } from "preact/hooks"
import randomColor from "randomcolor"
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"

type FrameTweenProps = {
    frameNum: number
    frameNums: Array<number>
    index: number
}

const FrameTween = ({ frameNum, frameNums, index }: FrameTweenProps) => {
    const background = useMemo(() => randomColor(), [])

    return (
        <div
            style={{
                width:
                    Math.max((frameNums[index + 1] ?? frameNum) - frameNum, 1) *
                    FRAME_WIDTH,
                height: FRAME_HEIGHT,
                position: "absolute",
                left: frameNum * FRAME_WIDTH,
                background,
                opacity: 0.1
            }}
        />
    )
}

export default memo(
    FrameTween,
    (prev, next) => prev.frameNums === next.frameNums
)

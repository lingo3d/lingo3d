import { memo } from "preact/compat"
import { useMemo } from "preact/hooks"
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"

type FrameTweenProps = {
    frameNum: number
    frameNums: Array<number>
    index: number
}

const colors = [
    "#666666",
    "#777777",
    "#888888",
    "#999999",
    "#AAAAAA",
    "#BBBBBB",
    "#CCCCCC",
    "#DDDDDD",
    "#EEEEEE",
    "#FFFFFF",
]
let colorIndex = 0

const FrameTween = ({ frameNum, frameNums, index }: FrameTweenProps) => {
    const background = useMemo(() => {
        if (colorIndex === colors.length) colorIndex = 0
        return colors[colorIndex++]
    }, [])

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
                opacity: 0.05
            }}
        />
    )
}

export default memo(
    FrameTween,
    (prev, next) => prev.frameNums === next.frameNums
)

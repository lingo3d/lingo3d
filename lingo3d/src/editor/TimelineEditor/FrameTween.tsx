import { memo, useMemo } from "preact/compat"
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"

const colors = [
    "#880E4F",
    "#311B92",
    "#0D47A1",
    "#006064",
    "#1B5E20",
    "#827717",
    "#FF6F00",
    "#BF360C"
]
let colorIndex = 0

type FrameTweenProps = {
    frameNum: number
    frameNums: Array<number>
    index: number
}

const FrameTween = ({ frameNum, frameNums, index }: FrameTweenProps) => {
    const background = useMemo(() => {
        if (++colorIndex === colors.length) colorIndex = 0
        return colors[colorIndex]
    }, [])

    return (
        <div
            className="lingo3d-flexcenter"
            style={{
                width:
                    Math.max((frameNums[index + 1] ?? frameNum) - frameNum, 1) *
                    FRAME_WIDTH,
                height: FRAME_HEIGHT,
                position: "absolute",
                left: frameNum * FRAME_WIDTH,
                opacity: 0.5
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: 10,
                    borderRadius: 999,
                    background
                }}
            />
        </div>
    )
}

export default memo(
    FrameTween,
    (prev, next) => prev.frameNums === next.frameNums
)

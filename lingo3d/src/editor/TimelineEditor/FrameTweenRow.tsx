import { memo } from "preact/compat"
import { useMemo } from "preact/hooks"
import { FRAME_HEIGHT } from "../../globals"
import FrameTween from "./FrameTween"

type FrameTweenRowProps = {
    frames: Record<number, true>
}

const FrameTweenRow = ({ frames }: FrameTweenRowProps) => {
    const frameNums = useMemo(() => Object.keys(frames).map(Number), [frames])

    return (
        <div style={{ height: FRAME_HEIGHT }}>
            {frameNums.map((frameNum, index) => (
                <FrameTween
                    key={frameNum}
                    frameNum={frameNum}
                    frameNums={frameNums}
                    index={index}
                />
            ))}
        </div>
    )
}

export default memo(FrameTweenRow, (prev, next) => prev.frames === next.frames)

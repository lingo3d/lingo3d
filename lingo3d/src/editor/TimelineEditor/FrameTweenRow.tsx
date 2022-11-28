import { memo } from "preact/compat"
import { useCallback, useMemo } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import TimelineAudio from "../../display/TimelineAudio"
import { FRAME_HEIGHT } from "../../globals"
import AudioRow from "./AudioRow"
import FrameTween from "./FrameTween"

type FrameTweenRowProps = {
    frames: Record<number, true>
    uuid: string
}

const FrameTweenRow = ({ frames, uuid }: FrameTweenRowProps) => {
    const frameNums = useMemo(() => Object.keys(frames).map(Number), [frames])
    const instance = useMemo(() => uuidMap.get(uuid), [uuid])

    if (!instance) return null

    if (instance instanceof TimelineAudio)
        return (
            <AudioRow
                instance={instance}
                startFrame={Number(Object.keys(frames)[0] ?? 0)}
            />
        )

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

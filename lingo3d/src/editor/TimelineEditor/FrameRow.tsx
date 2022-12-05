import { CSSProperties, memo, useMemo } from "preact/compat"
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import useSyncState from "../hooks/useSyncState"
import { timelineScrollLeftSignal } from "../../states/useTimelineScrollLeft"
import { getTimelineTotalFrames } from "../../states/useTimelineTotalFrames"
import diffProps from "../utils/diffProps"
import Frame from "./Frame"

type FrameGridProps = {
    width: number
    style?: CSSProperties
    layer: string
    keyframes: Record<number, true>
}

const FrameRow = ({ width, style, layer, keyframes }: FrameGridProps) => {
    const totalFrames = useSyncState(getTimelineTotalFrames)

    const RenderComponent = useMemo(
        () =>
            memo(
                ({ index, style }: { index: number; style: CSSProperties }) => {
                    return (
                        <Frame
                            key={index}
                            style={style}
                            keyframe={index in keyframes}
                            layer={layer}
                            index={index}
                        />
                    )
                },
                diffProps
            ),
        []
    )
    return (
        <VirtualizedListHorizontal
            scrollSignal={timelineScrollLeftSignal}
            itemNum={totalFrames}
            itemWidth={FRAME_WIDTH}
            containerWidth={width}
            containerHeight={FRAME_HEIGHT}
            style={{ ...style, overflowX: "hidden" }}
            RenderComponent={RenderComponent}
        />
    )
}

export default memo(FrameRow, diffProps)

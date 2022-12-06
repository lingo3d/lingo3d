import { CSSProperties, memo, useMemo } from "preact/compat"
import { FRAME_WIDTH, FRAME_HEIGHT, FRAME_MAX } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import { timelineScrollLeftSignal } from "../../states/useTimelineScrollLeft"
import diffProps from "../utils/diffProps"
import Frame from "./Frame"

//mark

type FrameGridProps = {
    width: number
    style?: CSSProperties
    layer: string
    keyframes: Record<number, true>
}

const FrameRow = ({ width, style, layer, keyframes }: FrameGridProps) => {
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
            itemNum={FRAME_MAX}
            itemWidth={FRAME_WIDTH}
            containerWidth={width}
            containerHeight={FRAME_HEIGHT}
            style={{ ...style, overflowX: "hidden" }}
            RenderComponent={RenderComponent}
        />
    )
}

export default memo(FrameRow, diffProps)

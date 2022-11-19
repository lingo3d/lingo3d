import { CSSProperties, memo } from "preact/compat"
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import { useTimelineScrollLeft, useTimelineTotalFrames } from "../states"
import Frame from "./Frame"

type FrameGridProps = {
    width: number
    style?: CSSProperties
    layer: string
    frames: Set<number>
}

const FrameRow = ({ width, style, layer, frames }: FrameGridProps) => {
    const [scrollLeft] = useTimelineScrollLeft()
    const [totalFrames] = useTimelineTotalFrames()

    return (
        <VirtualizedListHorizontal
            scrollLeft={scrollLeft}
            itemNum={totalFrames}
            itemWidth={FRAME_WIDTH}
            containerWidth={width}
            containerHeight={FRAME_HEIGHT}
            style={{ ...style, overflowX: "hidden" }}
            renderItem={({ index, style }) => (
                <Frame
                    key={index}
                    style={style}
                    keyframe={frames.has(index)}
                    layer={layer}
                    index={index}
                />
            )}
        />
    )
}

export default memo(FrameRow, () => true)

import { CSSProperties, useMemo } from "preact/compat"
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import { useTimelineScrollLeft, useTimelineFrameNum } from "../states"
import Frame from "./Frame"

type FrameGridProps = {
    width: number
    style?: CSSProperties
    layer: string
    frames: Set<number>
}

const FrameRow = ({ width, style, layer, frames }: FrameGridProps) => {
    const [scrollLeft, setScrollLeft] = useTimelineScrollLeft()
    const [frameNum] = useTimelineFrameNum()

    const framesSorted = useMemo(() => [...frames].sort(), [frames])

    return (
        <VirtualizedListHorizontal
            scrollLeft={scrollLeft}
            onScrollLeft={setScrollLeft}
            itemNum={frameNum}
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

export default FrameRow

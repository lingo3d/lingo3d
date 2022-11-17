import { FRAME_WIDTH, LAYER_HEIGHT } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import { useTimelineScrollLeft, useTimelineFrameNum } from "../states"

type FrameGridProps = {
    width: number
}

const FrameGrid = ({ width }: FrameGridProps) => {
    const [scrollLeft, setScrollLeft] = useTimelineScrollLeft()
    const [frameNum] = useTimelineFrameNum()

    return (
        <VirtualizedListHorizontal
            scrollLeft={scrollLeft}
            onScrollLeft={setScrollLeft}
            itemNum={frameNum}
            itemWidth={FRAME_WIDTH}
            containerWidth={width}
            containerHeight={LAYER_HEIGHT}
            renderItem={({ index, style }) => (
                <div
                    key={index}
                    style={{
                        ...style,
                        width: FRAME_WIDTH,
                        height: LAYER_HEIGHT - 4,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderLeft: "none"
                    }}
                ></div>
            )}
        />
    )
}

export default FrameGrid

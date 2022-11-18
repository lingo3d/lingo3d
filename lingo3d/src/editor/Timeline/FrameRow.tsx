import { CSSProperties } from "preact/compat"
import { FRAME_WIDTH, FRAME_HEIGHT } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import { useTimelineScrollLeft, useTimelineFrameNum } from "../states"

type FrameGridProps = {
    width: number
    style?: CSSProperties
    property: string
    frames: Set<number>
}

const FrameRow = ({ width, style, property, frames }: FrameGridProps) => {
    const [scrollLeft, setScrollLeft] = useTimelineScrollLeft()
    const [frameNum] = useTimelineFrameNum()

    return (
        <VirtualizedListHorizontal
            scrollLeft={scrollLeft}
            onScrollLeft={setScrollLeft}
            itemNum={frameNum}
            itemWidth={FRAME_WIDTH}
            containerWidth={width}
            containerHeight={FRAME_HEIGHT}
            style={style}
            renderItem={({ index, style }) => (
                <div
                    key={index}
                    className="lingo3d-flexcenter"
                    style={{
                        ...style,
                        width: FRAME_WIDTH,
                        height: FRAME_HEIGHT - 4,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderLeft: "none"
                    }}
                >
                    {frames.has(index) && (
                        <div
                            style={{
                                background: "yellow",
                                width: 4,
                                height: 4
                            }}
                        />
                    )}
                </div>
            )}
        />
    )
}

export default FrameRow

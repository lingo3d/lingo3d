import { CSSProperties, useMemo } from "preact/compat"
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

    const framesSorted = useMemo(() => [...frames].sort(), [frames])

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
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        borderLeft: "none",
                        background: frames.has(index)
                            ? "rgba(255 ,255, 255, 0.1)"
                            : undefined
                    }}
                >
                    {frames.has(index) && (
                        <div
                            style={{
                                width: 4,
                                height: 4,
                                background: "rgba(255, 255, 255, 0.2)"
                            }}
                        />
                    )}
                </div>
            )}
        />
    )
}

export default FrameRow

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

const getIndex = (
    num: number,
    range: number,
    interval: number,
    list: Array<number>
) => {
    const idx = Math.trunc((num + interval / 2) / interval)
    return Math.abs(list[idx] - num) <= range ? idx : -1
}

const findRange = (list: Array<number>) => {
    const interval = list[1]
    const range = 2

    // Test for all numbers within the list
    for (var i = 0; i < list[list.length - 1]; i++) {
        const res = getIndex(i, range, interval, list)

        if (res === -1) {
            console.log(`${i} is out of range ${range}`)
        } else {
            console.log(`${i} is within range ${range} of index ${res}`)
        }

        if (i % interval === interval - 1) {
            console.log("---------------------")
        }
    }
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

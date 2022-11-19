import { APPBAR_HEIGHT, FRAME_WIDTH } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import { useTimelineScrollLeft, useTimelineTotalFrames } from "../states"
import Metric from "./Metric"

type RulerProps = {
    width: number
}

const Ruler = ({ width }: RulerProps) => {
    const [scrollLeft] = useTimelineScrollLeft()
    const [totalFrames] = useTimelineTotalFrames()

    return (
        <VirtualizedListHorizontal
            scrollLeft={scrollLeft}
            itemNum={totalFrames / 5 + 3}
            itemWidth={FRAME_WIDTH * 5}
            containerWidth={width}
            containerHeight={APPBAR_HEIGHT}
            style={{ overflowX: "hidden" }}
            renderItem={({ index, style }) => (
                <Metric key={index} index={index} style={style} />
            )}
        />
    )
}

export default Ruler

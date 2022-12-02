import { APPBAR_HEIGHT, FRAME_WIDTH } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import useSyncState from "../hooks/useSyncState"
import { getTimelineScrollLeft } from "../../states/useTimelineScrollLeft"
import { getTimelineTotalFrames } from "../../states/useTimelineTotalFrames"
import Metric from "./Metric"

type RulerProps = {
    width: number
}

const Ruler = ({ width }: RulerProps) => {
    const scrollLeft = useSyncState(getTimelineScrollLeft)
    const totalFrames = useSyncState(getTimelineTotalFrames)

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

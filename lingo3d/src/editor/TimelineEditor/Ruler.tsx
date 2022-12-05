import { APPBAR_HEIGHT, FRAME_WIDTH } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import useSyncState from "../hooks/useSyncState"
import { timelineScrollLeftSignal } from "../../states/useTimelineScrollLeft"
import { getTimelineTotalFrames } from "../../states/useTimelineTotalFrames"
import Metric from "./Metric"
import { useMemo } from "preact/hooks"
import { CSSProperties, memo } from "preact/compat"
import diffProps from "../utils/diffProps"

type RulerProps = {
    width: number
}

const Ruler = ({ width }: RulerProps) => {
    const totalFrames = useSyncState(getTimelineTotalFrames)

    const RenderComponent = useMemo(
        () =>
            memo(
                ({ index, style }: { index: number; style: CSSProperties }) => {
                    return <Metric key={index} index={index} style={style} />
                },
                diffProps
            ),
        []
    )
    return (
        <VirtualizedListHorizontal
            scrollSignal={timelineScrollLeftSignal}
            itemNum={totalFrames / 5 + 3}
            itemWidth={FRAME_WIDTH * 5}
            containerWidth={width}
            containerHeight={APPBAR_HEIGHT}
            style={{ overflowX: "hidden" }}
            RenderComponent={RenderComponent}
        />
    )
}

export default Ruler

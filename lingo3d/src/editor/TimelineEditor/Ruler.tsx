import { APPBAR_HEIGHT, FRAME_MAX, FRAME_WIDTH } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import { timelineScrollLeftSignal } from "../../states/useTimelineScrollLeft"
import Metric from "./Metric"
import { useMemo } from "preact/hooks"
import { CSSProperties, memo } from "preact/compat"
import diffProps from "../utils/diffProps"

type RulerProps = {
    width: number
}

export const maxFramePtr = [45]

const Ruler = ({ width }: RulerProps) => {
    const RenderComponent = useMemo(
        () =>
            memo(
                ({ index, style }: { index: number; style: CSSProperties }) => {
                    maxFramePtr[0] = Math.max(index * 5, 45)
                    return <Metric key={index} index={index} style={style} />
                },
                diffProps
            ),
        []
    )
    return (
        <VirtualizedListHorizontal
            scrollSignal={timelineScrollLeftSignal}
            itemNum={FRAME_MAX / 5 + 3}
            itemWidth={FRAME_WIDTH * 5}
            containerWidth={width}
            containerHeight={APPBAR_HEIGHT}
            style={{ overflowX: "hidden" }}
            RenderComponent={RenderComponent}
        />
    )
}

export default Ruler

import { APPBAR_HEIGHT, FRAME_MAX, FRAME_WIDTH } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import Metric from "./Metric"
import { useEffect, useMemo } from "preact/hooks"
import { CSSProperties, memo } from "preact/compat"
import diffProps from "../utils/diffProps"
import { timelineScrollLeftSignal } from "./timelineScrollLeftSignal"
import {
    maxFramePtr,
    minFramePtr,
    framesWidthPtr
} from "../../pointers/timelineRulerPointers"

type RulerProps = {
    width: number
}

const renderedFrames: Record<number, true> = {}

const getMinMaxFrames = () => {
    const keys = Object.keys(renderedFrames)
    maxFramePtr[0] = Number(keys.at(-1))
    minFramePtr[0] = Number(keys[0])
}

const Ruler = ({ width }: RulerProps) => {
    framesWidthPtr[0] = Math.floor(width / 5) * 5

    const RenderComponent = useMemo(
        () =>
            memo(
                ({ index, style }: { index: number; style: CSSProperties }) => {
                    useEffect(() => {
                        const frame = index * 5
                        renderedFrames[frame] = true
                        getMinMaxFrames()

                        return () => {
                            delete renderedFrames[frame]
                            getMinMaxFrames()
                        }
                    }, [])

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

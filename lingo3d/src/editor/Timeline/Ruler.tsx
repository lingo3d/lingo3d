import { APPBAR_HEIGHT, FRAME_WIDTH } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import Metric from "./Metric"
import { useFrameNum, useScrollLeft } from "./states"

type RulerProps = {
    width: number
}

const Ruler = ({ width }: RulerProps) => {
    const [scrollLeft, setScrollLeft] = useScrollLeft()
    const [frameNum] = useFrameNum()

    return (
        <VirtualizedListHorizontal
            scrollLeft={scrollLeft}
            onScrollLeft={setScrollLeft}
            itemNum={frameNum / 5 + 1}
            itemWidth={FRAME_WIDTH * 5}
            containerWidth={width}
            containerHeight={APPBAR_HEIGHT}
            renderItem={({ index, style }) => (
                <Metric key={index} index={index} style={style} />
            )}
        />
    )
}

export default Ruler

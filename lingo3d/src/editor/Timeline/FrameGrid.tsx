import { FRAME_WIDTH, LAYER_HEIGHT } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import { useScrollLeft } from "./states"

type FrameGridProps = {
    width: number
}

const FrameGrid = ({ width }: FrameGridProps) => {
    const [scrollLeft, setScrollLeft] = useScrollLeft()

    return (
        <VirtualizedListHorizontal
            scrollLeft={scrollLeft}
            onScrollLeft={setScrollLeft}
            itemNum={100}
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

import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import config from "./config"
import { useScrollLeft } from "./states"

const FrameGrid = () => {
    const { layerHeight, frameWidth } = config
    const [scrollLeft, setScrollLeft] = useScrollLeft()

    return (
        <VirtualizedListHorizontal
            scrollLeft={scrollLeft}
            onScrollLeft={setScrollLeft}
            itemNum={100}
            itemWidth={frameWidth}
            containerWidth={300}
            containerHeight={layerHeight}
            renderItem={({ index, style }) => (
                <div
                    key={index}
                    style={{
                        ...style,
                        width: frameWidth,
                        height: layerHeight - 4,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderLeft: "none"
                    }}
                ></div>
            )}
        />
    )
}

export default FrameGrid

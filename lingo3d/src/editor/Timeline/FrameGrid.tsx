import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import config from "./config"

const FrameGrid = () => {
    const { layerHeight, frameWidth } = config

    return (
        <VirtualizedListHorizontal
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

import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import config from "./config"

const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100

type CellProps = {
    index: number
    style: React.CSSProperties
}

const Cell = ({ index, style }: CellProps) => {
    const rounded = round((index * 5) / 60)
    const showSeconds = (rounded * 100) % 5 === 0

    return (
        <div style={style}>
            <div style={{ opacity: showSeconds ? 0.75 : 0.65 }}>
                <div style={{ display: "flex" }}>
                    <div
                        style={{
                            width: 1,
                            height: showSeconds ? 22 : 16,
                            background: "white"
                        }}
                    />
                    {index * 5}
                </div>
                {showSeconds && rounded + "s"}
            </div>
        </div>
    )
}


const Ruler: React.FC = () => {
    const framesNum = 100

    return (
        <VirtualizedListHorizontal
            itemNum={framesNum}
            itemWidth={config.frameWidth * 2}
            containerWidth={300}
            containerHeight={100}
            renderItem={({ index, style }) => (
                <Cell index={index} style={style} />
            )}
        />
    )
}

export default Ruler

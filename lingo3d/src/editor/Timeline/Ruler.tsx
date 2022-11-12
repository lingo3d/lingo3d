import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import { FRAME_WIDTH } from "./globals"
import { useScrollLeft } from "./states"

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
            <div
                style={{
                    opacity: showSeconds ? 0.75 : 0.65,
                    marginLeft: FRAME_WIDTH * 0.5
                }}
            >
                <div style={{ display: "flex" }}>
                    <div
                        style={{
                            width: 1,
                            marginRight: 2,
                            height: showSeconds ? 20 : 12,
                            background: "white"
                        }}
                    />
                    {index * 5}
                </div>
                {showSeconds && <div style={{ fontSize: 10 }}>{rounded}s</div>}
            </div>
        </div>
    )
}

const Ruler: React.FC = () => {
    const [scrollLeft, setScrollLeft] = useScrollLeft()

    return (
        <VirtualizedListHorizontal
            scrollLeft={scrollLeft}
            onScrollLeft={setScrollLeft}
            itemNum={100}
            itemWidth={FRAME_WIDTH * 2}
            containerWidth={300}
            containerHeight={50}
            renderItem={({ index, style }) => (
                <Cell key={index} index={index} style={style} />
            )}
        />
    )
}

export default Ruler

import { Grid, AutoSizer } from "react-virtualized"
import config from "./config"

const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100

const Cell: React.FC<{ columnIndex: number, style: React.CSSProperties, key: string }> = ({ columnIndex, style, key }) => {
    const rounded = round(columnIndex * 5 / 60)
    const showSeconds = rounded * 100 % 5 === 0

    return (
        <div key={key} style={style} className="text-xs">
            <div className="absolute" style={{
                left: config.frameWidth / 2,
                opacity: showSeconds ? 0.75 : 0.65
            }}>
                <div className="flex">
                    <div className="bg-white mr-1" style={{
                        width: 1,
                        height: showSeconds ? 22 : 16
                    }} />
                    {columnIndex * 5}
                </div>
                {showSeconds && rounded + "s"}
            </div>
        </div>
    )
}

const Ruler: React.FC = () => {
    const { useFramesNum, initScroll } = useContext(StateContext)

    const { frameWidth } = config
    const [framesNum] = useFramesNum()

    const elRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        initScroll(elRef.current?.querySelector(".ReactVirtualized__Grid"))
    }, [])

    return (
        <div className="absfull" ref={elRef}>
            <AutoSizer>
                {({ width }) => (
                    <Grid
                     className="overflow-y-hidden overflow-x-scroll"
                     width={width}
                     height={100}
                     columnWidth={frameWidth * 5}
                     rowHeight={100}
                     columnCount={framesNum / 5}
                     rowCount={1}
                     cellRenderer={Cell}
                    />
                )}
            </AutoSizer>
            
        </div>
    )
}

export default Ruler
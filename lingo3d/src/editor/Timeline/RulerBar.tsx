import useResizeObserver from "../hooks/useResizeObserver"
import Ruler from "./Ruler"

const TimelineBar = () => {
    const [ref, { width }] = useResizeObserver()

    return (
        <div
            ref={ref}
            className="lingo3d-absfull"
            style={{
                display: "flex",
                alignItems: "center",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)"
            }}
        >
            <Ruler width={width} />
        </div>
    )
}
export default TimelineBar

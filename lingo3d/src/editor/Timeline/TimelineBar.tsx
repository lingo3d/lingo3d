import useResizeObserver from "../hooks/useResizeObserver"
import Ruler from "./Ruler"

const TimelineBar = () => {
    const [ref, { width }] = useResizeObserver()

    return (
        <div className="lingo3d-absfull" ref={ref}>
            <Ruler width={width} />
        </div>
    )
}
export default TimelineBar

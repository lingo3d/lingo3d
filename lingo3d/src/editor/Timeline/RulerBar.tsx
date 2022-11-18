import useResizeObserver from "../hooks/useResizeObserver"
import { addTimelineScrollLeft } from "../states"
import Needle from "./Needle"
import Ruler from "./Ruler"

const RulerBar = () => {
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
            onWheel={(e) => {
                e.preventDefault()
                addTimelineScrollLeft(e.deltaX)
            }}
        >
            <Ruler width={width} />
            <Needle />
        </div>
    )
}
export default RulerBar

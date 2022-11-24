import AppBar from "../component/bars/AppBar"
import useResizeObserver from "../hooks/useResizeObserver"
import { addTimelineScrollLeft } from "../states/useTimelineScrollLeft"
import Needle from "./Needle"
import Ruler from "./Ruler"

const RulerBar = () => {
    const [ref, { width }] = useResizeObserver()

    return (
        <AppBar>
            <div
                ref={ref}
                className="lingo3d-absfull"
                onWheel={(e) => {
                    e.preventDefault()
                    addTimelineScrollLeft(e.deltaX)
                }}
            >
                <Ruler width={width} />
                <Needle />
            </div>
        </AppBar>
    )
}
export default RulerBar

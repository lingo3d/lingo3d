import AppBar from "../component/bars/AppBar"
import useResizeObserver from "../hooks/useResizeObserver"
import useSyncState from "../hooks/useSyncState"
import { getTimeline } from "../../states/useTimeline"
import Needle from "./Needle"
import Ruler from "./Ruler"

const RulerBar = () => {
    const [ref, { width }] = useResizeObserver()
    const timeline = useSyncState(getTimeline)

    return (
        <AppBar>
            <div
                ref={ref}
                className="lingo3d-absfull"
                style={{ opacity: timeline ? 1 : 0.2 }}
            >
                <Ruler width={width} />
                <Needle />
            </div>
        </AppBar>
    )
}
export default RulerBar

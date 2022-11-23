import { APPBAR_HEIGHT, PANELS_HEIGHT } from "../../globals"
import { addTimelineScrollLeft } from "../states/useTimelineScrollLeft"
import useInitCSS from "../utils/useInitCSS"
import Controls from "./Controls"
import Frames from "./Frames"
import TimelineContextMenu from "./TimelineContextMenu"
import TimelineGraph from "./TimelineGraph"

const TimelineEditor = () => {
    useInitCSS(true)

    return (
        <>
            <div
                className="lingo3d-ui lingo3d-bg lingo3d-panels"
                style={{
                    height: PANELS_HEIGHT - APPBAR_HEIGHT,
                    width: "100%",
                    display: "flex"
                }}
            >
                <TimelineGraph />
                <div
                    style={{ flexGrow: 1 }}
                    onWheel={(e) => {
                        e.preventDefault()
                        addTimelineScrollLeft(e.deltaX)
                    }}
                >
                    <Frames />
                    <Controls />
                </div>
            </div>
            <TimelineContextMenu />
        </>
    )
}
export default TimelineEditor

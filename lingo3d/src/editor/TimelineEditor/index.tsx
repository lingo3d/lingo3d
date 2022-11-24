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
                    height: "100%",
                    width: "100%",
                    display: "flex"
                }}
            >
                <div
                    style={{
                        width: 200,
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <div style={{ flexGrow: 1 }}>
                        <TimelineGraph />
                    </div>
                </div>
                <div
                    style={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column"
                    }}
                    onWheel={(e) => {
                        e.preventDefault()
                        addTimelineScrollLeft(e.deltaX)
                    }}
                >
                    <div style={{ flexGrow: 1 }}>
                        <Frames />
                    </div>
                    <Controls />
                </div>
            </div>
            <TimelineContextMenu />
        </>
    )
}
export default TimelineEditor

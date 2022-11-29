import { addTimelineScrollLeft } from "../states/useTimelineScrollLeft"
import useInitCSS from "../hooks/useInitCSS"
import Frames from "./Frames"
import RulerBar from "./RulerBar"
import TimelineBar from "./TimelineBar"
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
                    <TimelineBar />
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
                    <RulerBar />
                    <div style={{ flexGrow: 1 }}>
                        <Frames />
                    </div>
                </div>
            </div>
            <TimelineContextMenu />
        </>
    )
}
export default TimelineEditor

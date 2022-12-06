import useInitCSS from "../hooks/useInitCSS"
import RulerBar from "./RulerBar"
import Scroller from "./Scroller"
import TimelineBar from "./TimelineBar"
import TimelineContextMenu from "./TimelineContextMenu"
import TimelineGraph from "./TimelineGraph"

const TimelineEditor = () => {
    useInitCSS()

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
                >
                    <RulerBar />
                    <div style={{ flexGrow: 1 }}>
                        <Scroller />
                    </div>
                </div>
            </div>
            <TimelineContextMenu />
        </>
    )
}
export default TimelineEditor

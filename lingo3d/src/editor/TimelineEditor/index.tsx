import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import { sceneGraphWidthSignal } from "../signals/sizeSignals"
import RulerBar from "./RulerBar"
import Scroller from "./Scroller"
import TimelineBar from "./TimelineBar"
import TimelineContextMenu from "./TimelineContextMenu"
import TimelineGraph from "./TimelineGraph"

const TimelineEditor = () => {
    useInitCSS()
    useInitEditor()

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
                    className="lingo3d-flexcol"
                    style={{ width: sceneGraphWidthSignal.value }}
                >
                    <TimelineBar />
                    <div style={{ flexGrow: 1 }}>
                        <TimelineGraph />
                    </div>
                </div>
                <div className="lingo3d-flexcol" style={{ flexGrow: 1 }}>
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

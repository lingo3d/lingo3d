import { Point } from "@lincode/math"
import { useSignal } from "@preact/signals"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import RulerBar from "./RulerBar"
import Scroller from "./Scroller"
import TimelineBar from "./TimelineBar"
import TimelineContextMenu from "./TimelineContextMenu"
import TimelineGraph from "./TimelineGraph"

export type TimelineContextMenuPosition =
    | (Point & {
          keyframe?: boolean
          create?: "audio" | "timeline"
      })
    | undefined

const TimelineEditor = () => {
    useInitCSS()
    useInitEditor()

    const positionSignal = useSignal<TimelineContextMenuPosition>(undefined)

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
                <div className="lingo3d-flexcol" style={{ width: 200 }}>
                    <TimelineBar positionSignal={positionSignal} />
                    <div style={{ flexGrow: 1 }}>
                        <TimelineGraph />
                    </div>
                </div>
                <div className="lingo3d-flexcol" style={{ flexGrow: 1 }}>
                    <RulerBar />
                    <div style={{ flexGrow: 1 }}>
                        <Scroller positionSignal={positionSignal} />
                    </div>
                </div>
            </div>
            <TimelineContextMenu positionSignal={positionSignal} />
        </>
    )
}
export default TimelineEditor

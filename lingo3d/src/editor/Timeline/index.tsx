import register from "preact-custom-element"
import { APPBAR_HEIGHT, FRAME_WIDTH } from "../../globals"
import {
    getTimelineFrameNum,
    getTimelineScrollLeft,
    setTimelineScrollLeft
} from "../states"
import useInitCSS from "../utils/useInitCSS"
import Frames from "./Frames"
import TimelineGraph from "./TimelineGraph"

const Timeline = () => {
    useInitCSS(true)
    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-panels"
            style={{
                height: 200 - APPBAR_HEIGHT,
                width: "100%",
                display: "flex"
            }}
        >
            <TimelineGraph />
            <div
                style={{ flexGrow: 1 }}
                onWheel={(e) => {
                    e.preventDefault()
                    setTimelineScrollLeft(
                        Math.min(
                            Math.max(getTimelineScrollLeft() + e.deltaX, 0),
                            getTimelineFrameNum() * FRAME_WIDTH - 520
                        )
                    )
                }}
            >
                <Frames />
            </div>
        </div>
    )
}
export default Timeline

register(Timeline, "lingo3d-timeline")

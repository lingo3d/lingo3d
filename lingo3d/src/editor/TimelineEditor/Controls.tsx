import TitleBarButton from "../component/bars/TitleBarButton"
import { useTimeline } from "../states/useTimeline"
import {
    decreaseTimelineFrame,
    increaseTimelineFrame
} from "../states/useTimelineFrame"
import { useTimelinePaused } from "../states/useTimelinePaused"
import NextFrameIcon from "./icons/NextFrameIcon"
import PauseIcon from "./icons/PauseIcon"
import PlayIcon from "./icons/PlayIcon"
import PrevFrameIcon from "./icons/PrevFrameIcon"

const Controls = () => {
    const [timeline] = useTimeline()
    const [paused] = useTimelinePaused()

    return (
        <div
            className="lingo3d-bg"
            style={{
                position: "absolute",
                bottom: 8,
                border: "1px solid rgba(100, 100, 100, 0.1)",
                zIndex: 1,
                display: "flex"
            }}
        >
            {paused ? (
                <TitleBarButton
                    disabled={!timeline}
                    onClick={
                        timeline
                            ? () => {
                                  if (timeline.frame >= timeline.totalFrames)
                                      timeline.frame = 0
                                  timeline.paused = false
                              }
                            : undefined
                    }
                >
                    <PlayIcon />
                </TitleBarButton>
            ) : (
                <TitleBarButton
                    disabled={!timeline}
                    onClick={
                        timeline ? () => (timeline.paused = true) : undefined
                    }
                >
                    <PauseIcon />
                </TitleBarButton>
            )}
            <TitleBarButton
                disabled={!timeline}
                onClick={decreaseTimelineFrame}
            >
                <PrevFrameIcon />
            </TitleBarButton>
            <TitleBarButton
                disabled={!timeline}
                onClick={increaseTimelineFrame}
            >
                <NextFrameIcon />
            </TitleBarButton>
        </div>
    )
}

export default Controls

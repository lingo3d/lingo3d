import AppBar from "../component/bars/AppBar"
import TitleBarButton from "../component/bars/TitleBarButton"
import { useTimeline } from "../states/useTimeline"
import {
    decreaseTimelineFrame,
    increaseTimelineFrame
} from "../states/useTimelineFrame"
import { useTimelinePaused } from "../states/useTimelinePaused"
import FirstFrameIcon from "./icons/FirstFrameIcon"
import LastFrameIcon from "./icons/LastFrameIcon"
import NextFrameIcon from "./icons/NextFrameIcon"
import PauseIcon from "./icons/PauseIcon"
import PlayIcon from "./icons/PlayIcon"
import PrevFrameIcon from "./icons/PrevFrameIcon"

const Controls = () => {
    const [timeline] = useTimeline()
    const [paused] = useTimelinePaused()

    return (
        <AppBar>
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

            <TitleBarButton
                disabled={!timeline}
                onClick={decreaseTimelineFrame}
            >
                <FirstFrameIcon />
            </TitleBarButton>
            <TitleBarButton
                disabled={!timeline}
                onClick={increaseTimelineFrame}
            >
                <LastFrameIcon />
            </TitleBarButton>
        </AppBar>
    )
}

export default Controls

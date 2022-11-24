import AppBar from "../component/bars/AppBar"
import AppBarButton from "../component/bars/AppBarButton"
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
                <AppBarButton
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
                </AppBarButton>
            ) : (
                <AppBarButton
                    disabled={!timeline}
                    onClick={
                        timeline ? () => (timeline.paused = true) : undefined
                    }
                >
                    <PauseIcon />
                </AppBarButton>
            )}

            <AppBarButton disabled={!timeline} onClick={decreaseTimelineFrame}>
                <PrevFrameIcon />
            </AppBarButton>
            <AppBarButton disabled={!timeline} onClick={increaseTimelineFrame}>
                <NextFrameIcon />
            </AppBarButton>

            <AppBarButton disabled={!timeline} onClick={decreaseTimelineFrame}>
                <FirstFrameIcon />
            </AppBarButton>
            <AppBarButton disabled={!timeline} onClick={increaseTimelineFrame}>
                <LastFrameIcon />
            </AppBarButton>
        </AppBar>
    )
}

export default Controls

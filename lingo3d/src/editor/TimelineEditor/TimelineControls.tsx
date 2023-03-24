import AppBar from "../component/bars/AppBar"
import AppBarButton from "../component/AppBarButton"
import useSyncState from "../hooks/useSyncState"
import { getTimeline } from "../../states/useTimeline"
import {
    decreaseTimelineFrame,
    firstTimelineFrame,
    increaseTimelineFrame,
    lastTimelineFrame
} from "../../states/useTimelineFrame"
import { getTimelinePaused } from "../../states/useTimelinePaused"
import FirstFrameIcon from "./icons/FirstFrameIcon"
import LastFrameIcon from "./icons/LastFrameIcon"
import NextFrameIcon from "./icons/NextFrameIcon"
import PauseIcon from "../component/icons/PauseIcon"
import PlayIcon from "../component/icons/PlayIcon"
import PrevFrameIcon from "./icons/PrevFrameIcon"
import {
    getTimelineRecord,
    setTimelineRecord
} from "../../states/useTimelineRecord"
import AudioIcon from "./icons/AudioIcon"
import { getTimelineMute, setTimelineMute } from "../../states/useTimelineMute"
import MuteIcon from "./icons/MuteIcon"
import { highlightFrame } from "./FrameIndicator"

const TimelineControls = () => {
    const timeline = useSyncState(getTimeline)
    const paused = useSyncState(getTimelinePaused)
    const record = useSyncState(getTimelineRecord)
    const mute = useSyncState(getTimelineMute)

    return (
        <AppBar noPadding>
            {paused ? (
                <AppBarButton
                    outline
                    disabled={!timeline}
                    onClick={
                        timeline
                            ? () => {
                                  if (timeline.frame >= timeline.totalFrames)
                                      timeline.frame = 0
                                  highlightFrame()
                                  timeline.paused = false
                              }
                            : undefined
                    }
                >
                    <PlayIcon />
                </AppBarButton>
            ) : (
                <AppBarButton
                    outline
                    disabled={!timeline}
                    onClick={
                        timeline
                            ? () => {
                                  highlightFrame()
                                  timeline.paused = true
                              }
                            : undefined
                    }
                >
                    <PauseIcon />
                </AppBarButton>
            )}

            <AppBarButton
                outline
                disabled={!timeline}
                onClick={decreaseTimelineFrame}
            >
                <PrevFrameIcon />
            </AppBarButton>
            <AppBarButton
                outline
                disabled={!timeline}
                onClick={increaseTimelineFrame}
            >
                <NextFrameIcon />
            </AppBarButton>

            <AppBarButton
                outline
                disabled={!timeline}
                onClick={firstTimelineFrame}
            >
                <FirstFrameIcon />
            </AppBarButton>
            <AppBarButton
                outline
                disabled={!timeline}
                onClick={lastTimelineFrame}
            >
                <LastFrameIcon />
            </AppBarButton>
            <AppBarButton
                outline
                disabled={!timeline}
                onClick={
                    timeline
                        ? () => {
                              setTimelineRecord(!record)
                              highlightFrame()
                              timeline.paused = true
                          }
                        : undefined
                }
            >
                <div
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        background: record ? "red" : "white"
                    }}
                />
            </AppBarButton>
            <AppBarButton
                outline
                disabled={!timeline}
                onClick={() => setTimelineMute(!mute)}
            >
                {mute ? <MuteIcon /> : <AudioIcon />}
            </AppBarButton>
        </AppBar>
    )
}

export default TimelineControls

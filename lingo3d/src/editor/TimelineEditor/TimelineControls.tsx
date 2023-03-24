import AppBar from "../component/bars/AppBar"
import IconButton from "../component/IconButton"
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
        <AppBar noPadding style={{ gap: 4 }}>
            {paused ? (
                <IconButton
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
                </IconButton>
            ) : (
                <IconButton
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
                </IconButton>
            )}

            <IconButton disabled={!timeline} onClick={decreaseTimelineFrame}>
                <PrevFrameIcon />
            </IconButton>
            <IconButton disabled={!timeline} onClick={increaseTimelineFrame}>
                <NextFrameIcon />
            </IconButton>

            <IconButton disabled={!timeline} onClick={firstTimelineFrame}>
                <FirstFrameIcon />
            </IconButton>
            <IconButton disabled={!timeline} onClick={lastTimelineFrame}>
                <LastFrameIcon />
            </IconButton>
            <IconButton
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
            </IconButton>
            <IconButton
                disabled={!timeline}
                onClick={() => setTimelineMute(!mute)}
            >
                {mute ? <MuteIcon /> : <AudioIcon />}
            </IconButton>
        </AppBar>
    )
}

export default TimelineControls

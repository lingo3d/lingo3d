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
import { deselectFrameIndicator } from "./FrameIndicator"

const Controls = () => {
    const timeline = useSyncState(getTimeline)
    const paused = useSyncState(getTimelinePaused)
    const record = useSyncState(getTimelineRecord)

    return (
        <AppBar noPadding>
            {paused ? (
                <IconButton
                    outline
                    disabled={!timeline}
                    onClick={
                        timeline
                            ? () => {
                                  if (timeline.frame >= timeline.totalFrames)
                                      timeline.frame = 0
                                  deselectFrameIndicator()
                                  timeline.paused = false
                              }
                            : undefined
                    }
                >
                    <PlayIcon />
                </IconButton>
            ) : (
                <IconButton
                    outline
                    disabled={!timeline}
                    onClick={timeline ? deselectFrameIndicator : undefined}
                >
                    <PauseIcon />
                </IconButton>
            )}

            <IconButton
                outline
                disabled={!timeline}
                onClick={decreaseTimelineFrame}
            >
                <PrevFrameIcon />
            </IconButton>
            <IconButton
                outline
                disabled={!timeline}
                onClick={increaseTimelineFrame}
            >
                <NextFrameIcon />
            </IconButton>

            <IconButton
                outline
                disabled={!timeline}
                onClick={firstTimelineFrame}
            >
                <FirstFrameIcon />
            </IconButton>
            <IconButton
                outline
                disabled={!timeline}
                onClick={lastTimelineFrame}
            >
                <LastFrameIcon />
            </IconButton>
            <IconButton
                outline
                disabled={!timeline}
                onClick={() => {
                    setTimelineRecord(!record)
                    deselectFrameIndicator()
                }}
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
        </AppBar>
    )
}

export default Controls

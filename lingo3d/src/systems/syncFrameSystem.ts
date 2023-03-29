import Timeline from "../display/Timeline"
import { setTimelineFrame } from "../states/useTimelineFrame"
import renderSystem from "./utils/renderSystem"

export const [addSyncFrameSystem, deleteSyncFrameSystem] = renderSystem(
    (timeline: Timeline) => {
        let { frame, totalFrames } = timeline
        if (frame >= totalFrames) {
            frame = timeline.frame = totalFrames
            timeline.paused = true
        }
        setTimelineFrame(frame)
    }
)

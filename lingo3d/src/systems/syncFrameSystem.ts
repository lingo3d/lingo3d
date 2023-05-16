import Timeline from "../display/Timeline"
import { setTimelineFrame } from "../states/useTimelineFrame"
import renderSystem from "./utils/renderSystem"

export const [addSyncFrameSystem, deleteSyncFrameSystem] = renderSystem(
    (timeline: Timeline) => {
        let { frame, lastFrame } = timeline
        if (frame >= lastFrame) {
            frame = timeline.frame = lastFrame
            timeline.paused = true
        }
        setTimelineFrame(frame)
    }
)

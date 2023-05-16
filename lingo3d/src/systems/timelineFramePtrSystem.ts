import Timeline from "../display/Timeline"
import { timelineFramePtr } from "../pointers/timelineFramePtr"
import renderSystem from "./utils/renderSystem"

export const [addTimelineFramePtrSystem, deleteTimelineFramePtrSystem] =
    renderSystem((self: Timeline) => (timelineFramePtr[0] = self.frame))

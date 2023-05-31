import Timeline from "../display/Timeline"
import { timelineFramePtr } from "../pointers/timelineFramePtr"
import createSystem from "./utils/createInternalSystem"

export const timelineFramePtrSystem = createSystem("timelineFramePtrSystem", {
    update: (self: Timeline) => (timelineFramePtr[0] = self.frame)
})

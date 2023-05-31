import Timeline from "../display/Timeline"
import { timelineFramePtr } from "../pointers/timelineFramePtr"
import createInternalSystem from "./utils/createInternalSystem"

export const timelineFramePtrSystem = createInternalSystem("timelineFramePtrSystem", {
    update: (self: Timeline) => (timelineFramePtr[0] = self.frame)
})

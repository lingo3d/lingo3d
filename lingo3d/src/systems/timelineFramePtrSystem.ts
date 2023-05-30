import Timeline from "../display/Timeline"
import { timelineFramePtr } from "../pointers/timelineFramePtr"
import createSystem from "./utils/createSystem"

export const timelineFramePtrSystem = createSystem({
    update: (self: Timeline) => (timelineFramePtr[0] = self.frame)
})

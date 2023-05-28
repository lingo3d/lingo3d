import Timeline from "../display/Timeline"
import { timelineFramePtr } from "../pointers/timelineFramePtr"
import gameSystem from "./utils/gameSystem"

export const timelineFramePtrSystem = gameSystem({
    update: (self: Timeline) => (timelineFramePtr[0] = self.frame)
})

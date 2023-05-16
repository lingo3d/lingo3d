import store from "@lincode/reactivity"
import { timelineFramePtr } from "../pointers/timelineFramePtr"

export const [setTimelineFrame, getTimelineFrame] = store(-1)

getTimelineFrame((val) => (timelineFramePtr[0] = val))

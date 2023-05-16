import { FRAME_WIDTH } from "../../globals"
import { timelineFramePtr } from "../../pointers/timelineFramePtr"
import { timelineNeedlePtr } from "../../pointers/timelineNeedlePtr"
import { timelineScrollLeftSignal } from "./timelineScrollLeftSignal"

export default () =>
    (timelineNeedlePtr[0]!.style.left = `${
        -timelineScrollLeftSignal.value + timelineFramePtr[0] * FRAME_WIDTH
    }px`)

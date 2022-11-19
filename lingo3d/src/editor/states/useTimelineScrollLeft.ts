import { FRAME_WIDTH } from "../../globals"
import preactStore from "../utils/preactStore"
import { getTimelineTotalFrames } from "./useTimelineTotalFrames"

const [useTimelineScrollLeft, _setTimelineScrollLeft, getTimelineScrollLeft] =
    preactStore(0)
export { useTimelineScrollLeft }
export const addTimelineScrollLeft = (deltaX: number) =>
    _setTimelineScrollLeft(
        Math.min(
            Math.max(getTimelineScrollLeft() + deltaX, 0),
            getTimelineTotalFrames() * FRAME_WIDTH - 520
        )
    )

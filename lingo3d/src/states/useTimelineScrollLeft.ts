import store from "@lincode/reactivity"
import { FRAME_WIDTH } from "../globals"
import { getTimelineTotalFrames } from "./useTimelineTotalFrames"

const [_setTimelineScrollLeft, getTimelineScrollLeft] = store(0)
export { getTimelineScrollLeft }
export const addTimelineScrollLeft = (deltaX: number) =>
    _setTimelineScrollLeft(
        Math.min(
            Math.max(getTimelineScrollLeft() + deltaX, 0),
            getTimelineTotalFrames() * FRAME_WIDTH - 520
        )
    )

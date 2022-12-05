import store from "@lincode/reactivity"
import { signal } from "@preact/signals"
import { FRAME_WIDTH } from "../globals"
import { getTimelineTotalFrames } from "./useTimelineTotalFrames"

const [setTimelineScrollLeft, getTimelineScrollLeft] = store(0)
export { getTimelineScrollLeft }

export const timelineScrollLeftSignal = signal(0)
getTimelineScrollLeft((val) => (timelineScrollLeftSignal.value = val))

export const addTimelineScrollLeft = (deltaX: number) =>
    setTimelineScrollLeft(
        Math.min(
            Math.max(getTimelineScrollLeft() + deltaX, 0),
            getTimelineTotalFrames() * FRAME_WIDTH - 520
        )
    )

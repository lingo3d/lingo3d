import { createEffect } from "@lincode/reactivity"
import { onBeforeRender } from "../../events/onBeforeRender"
import { FRAME_WIDTH } from "../../globals"
import { timelineFramePtr } from "../../pointers/timelineFramePtr"
import { timelinePausedPtr } from "../../pointers/timelinePausedPtr"
import {
    maxFramePtr,
    minFramePtr,
    framesWidthPtr
} from "../../pointers/timelineRulerPointers"
import { timelineScrollerPtr } from "../../pointers/timelineScrollerPtr"
import { getTimelinePaused } from "../../states/useTimelinePaused"
import timelineNeedleSeek from "./timelineNeedleSeek"

export const timelineScrollerSeek = () => {
    const frameDiv = timelineFramePtr[0] / 5
    const ceilFrame = Math.ceil(frameDiv) * 5
    const floorFrame = Math.floor(frameDiv) * 5
    if (ceilFrame > maxFramePtr[0])
        timelineScrollerPtr[0]!.scrollLeft = floorFrame * FRAME_WIDTH
    else if (floorFrame < minFramePtr[0])
        timelineScrollerPtr[0]!.scrollLeft =
            ceilFrame * FRAME_WIDTH - framesWidthPtr[0]

    timelineNeedleSeek()
}

createEffect(() => {
    if (timelinePausedPtr[0]) return
    const handle = onBeforeRender(timelineScrollerSeek)
    return () => {
        handle.cancel()
    }
}, [getTimelinePaused])

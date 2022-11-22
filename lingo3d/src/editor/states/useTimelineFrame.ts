import { createEffect } from "@lincode/reactivity"
import { getTimeline } from "../../states/useTimeline"
import preactStore from "../utils/preactStore"

export const [useTimelineFrame, setTimelineFrame, getTimelineFrame] =
    preactStore(0)

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return

    timeline.gotoFrame(getTimelineFrame())
    timeline.paused = true
}, [getTimelineFrame, getTimeline])

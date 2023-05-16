import store, { createEffect } from "@lincode/reactivity"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import { getTimeline } from "./useTimeline"
import getReactive from "../utils/getReactive"
import { timelinePtr } from "../pointers/timelinePtr"
import { timelinePausedPtr } from "../pointers/timelinePausedPtr"

const [setTimelinePaused, getTimelinePaused] = store(true)
export { getTimelinePaused }

getTimelinePaused((paused) => {
    timelinePausedPtr[0] = paused
    !paused && emitSelectionTarget(undefined)
})

createEffect(() => {
    const [timeline] = timelinePtr
    if (!timeline) return

    const handle = getReactive(timeline, "paused").get(setTimelinePaused)
    return () => {
        handle.cancel()
        setTimelinePaused(true)
    }
}, [getTimeline])

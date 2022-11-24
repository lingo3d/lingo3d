import { createEffect } from "@lincode/reactivity"
import preactStore from "../utils/preactStore"
import { getTimeline } from "./useTimeline"

const [useTimelinePaused, setTimelinePaused, getTimelinePaused] =
    preactStore(true)
export { useTimelinePaused, getTimelinePaused }

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return

    //@ts-ignore
    const handle = timeline.pausedState.get(setTimelinePaused)
    return () => {
        handle.cancel()
        setTimelinePaused(true)
    }
}, [getTimeline])

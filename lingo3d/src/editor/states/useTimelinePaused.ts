import { createEffect } from "@lincode/reactivity"
import { getTimeline } from "../../states/useTimeline"
import preactStore from "../utils/preactStore"

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

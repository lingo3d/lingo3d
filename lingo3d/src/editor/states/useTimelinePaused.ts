import { createEffect } from "@lincode/reactivity"
import getPrivateValue from "../../utils/getPrivateValue"
import preactStore from "../utils/preactStore"
import { getTimeline } from "./useTimeline"

const [useTimelinePaused, setTimelinePaused, getTimelinePaused] =
    preactStore(true)
export { useTimelinePaused, getTimelinePaused }

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return

    const handle = getPrivateValue(timeline, "pausedState").get(
        setTimelinePaused
    )
    return () => {
        handle.cancel()
        setTimelinePaused(true)
    }
}, [getTimeline])

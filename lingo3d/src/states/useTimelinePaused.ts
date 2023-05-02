import store, { createEffect } from "@lincode/reactivity"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import {
    addSyncFrameSystem,
    deleteSyncFrameSystem
} from "../systems/syncFrameSystem"
import { getTimeline } from "./useTimeline"
import getReactive from "../utils/getReactive"

const [setTimelinePaused, getTimelinePaused] = store(true)
export { getTimelinePaused }

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return

    const handle = getReactive(timeline, "paused").get(setTimelinePaused)
    return () => {
        handle.cancel()
        setTimelinePaused(true)
    }
}, [getTimeline])

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline || getTimelinePaused()) return

    emitSelectionTarget(undefined)

    addSyncFrameSystem(timeline)
    return () => {
        deleteSyncFrameSystem(timeline)
    }
}, [getTimeline, getTimelinePaused])

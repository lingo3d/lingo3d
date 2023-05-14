import store, { createEffect } from "@lincode/reactivity"
import Timeline from "../display/Timeline"
import {
    addClearStateSystem,
    deleteClearStateSystem
} from "../systems/eventSystems/clearStateSystem"

export const [setTimeline, getTimeline] = store<Timeline | undefined>(undefined)

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return
    addClearStateSystem(timeline, { setState: setTimeline })
    return () => {
        deleteClearStateSystem(timeline)
    }
}, [getTimeline])

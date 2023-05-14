import store, { createEffect } from "@lincode/reactivity"
import Timeline from "../display/Timeline"
import {
    addDisposeStateSystem,
    deleteDisposeStateSystem
} from "../systems/eventSystems/disposeStateSystem"

export const [setTimeline, getTimeline] = store<Timeline | undefined>(undefined)

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return
    addDisposeStateSystem(timeline, { setState: setTimeline })
    return () => {
        deleteDisposeStateSystem(timeline)
    }
}, [getTimeline])

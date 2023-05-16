import store, { createEffect } from "@lincode/reactivity"
import Timeline from "../display/Timeline"
import {
    addDisposeStateSystem,
    deleteDisposeStateSystem
} from "../systems/eventSystems/disposeStateSystem"
import { timelinePtr } from "../pointers/timelinePtr"

export const [setTimeline, getTimeline] = store<Timeline | undefined>(undefined)

getTimeline((val) => (timelinePtr[0] = val))

createEffect(() => {
    const [timeline] = timelinePtr
    if (!timeline) return
    addDisposeStateSystem(timeline, { setState: setTimeline })
    return () => {
        deleteDisposeStateSystem(timeline)
    }
}, [getTimeline])

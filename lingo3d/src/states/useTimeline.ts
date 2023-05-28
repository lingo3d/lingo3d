import store, { createEffect } from "@lincode/reactivity"
import Timeline from "../display/Timeline"
import {
    addDisposeStateSystem,
    deleteDisposeStateSystem
} from "../systems/eventSystems/disposeStateSystem"
import { timelinePtr } from "../pointers/timelinePtr"
import { timelineFramePtr } from "../pointers/timelineFramePtr"
import { timelineFramePtrSystem } from "../systems/timelineFramePtrSystem"

export const [setTimeline, getTimeline] = store<Timeline | undefined>(undefined)

getTimeline((val) => {
    timelinePtr[0] = val
    timelineFramePtr[0] = val ? 0 : -1
})

createEffect(() => {
    const [timeline] = timelinePtr
    if (!timeline) return
    addDisposeStateSystem(timeline, { setState: setTimeline })
    timelineFramePtrSystem.add(timeline)
    return () => {
        deleteDisposeStateSystem(timeline)
        timelineFramePtrSystem.delete(timeline)
    }
}, [getTimeline])

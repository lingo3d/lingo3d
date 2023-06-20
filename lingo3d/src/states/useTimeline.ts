import store, { createEffect } from "@lincode/reactivity"
import Timeline from "../display/Timeline"
import { disposeStateSystem } from "../systems/eventSystems/disposeStateSystem"
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
    disposeStateSystem.add(timeline, { setState: setTimeline })
    timelineFramePtrSystem.add(timeline)
    return () => {
        disposeStateSystem.delete(timeline)
        timelineFramePtrSystem.delete(timeline)
    }
}, [getTimeline])

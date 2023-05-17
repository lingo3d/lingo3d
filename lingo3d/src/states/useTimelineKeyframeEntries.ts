import store, { createEffect } from "@lincode/reactivity"
import { getTimelineExpandedUUIDs } from "./useTimelineExpandedUUIDs"
import { keyframesPtr } from "../pointers/keyframesPtr"
import { timelineDataPtr } from "../pointers/timelineDataPtr"
import { getTimelineData } from "./useTimelineData"

export const [setTimelineKeyframeEntries, getTimelineKeyframeEntries] = store<
    Array<[string, Record<number, true>]>
>([])

createEffect(() => {
    const [timelineData] = timelineDataPtr
    const [expandedUUIDs] = getTimelineExpandedUUIDs()
    if (!timelineData) {
        setTimelineKeyframeEntries([])
        return
    }
    keyframesPtr[0] = {}
    const [keyframes] = keyframesPtr
    for (const [uuid, data] of Object.entries(timelineData)) {
        const frameRecord: Record<string, true> = (keyframes[uuid] = {})
        for (const frames of Object.values(data))
            for (const frame of Object.keys(frames)) frameRecord[frame] = true

        if (!expandedUUIDs.has(uuid)) continue

        for (const [property, frames] of Object.entries(data)) {
            const layerFrameList: Record<string, true> = (keyframes[
                uuid + " " + property
            ] = {})
            for (const frame of Object.keys(frames))
                layerFrameList[frame] = true
        }
    }
    //mark
    setTimelineKeyframeEntries(Object.entries(keyframes))
}, [getTimelineExpandedUUIDs, getTimelineData])

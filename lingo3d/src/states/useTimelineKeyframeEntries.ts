import store, { createEffect } from "@lincode/reactivity"
import { getTimelineExpandedUUIDs } from "./useTimelineExpandedUUIDs"

export const [setTimelineKeyframeEntries, getTimelineKeyframeEntries] = store<
    Array<[string, Record<number, true>]>
>([])

type Keyframes = Record<string, Record<number, true>>
export const keyframesPtr: [Keyframes] = [{}]

import("./useTimelineData").then(({ getTimelineData }) => {
    createEffect(() => {
        const [timelineData] = getTimelineData()
        const [expandedUUIDs] = getTimelineExpandedUUIDs()
        if (!timelineData) {
            setTimelineKeyframeEntries([])
            return
        }
        const keyframes: Keyframes = (keyframesPtr[0] = {})
        for (const [uuid, data] of Object.entries(timelineData)) {
            const frameRecord: Record<string, true> = (keyframes[uuid] = {})
            for (const frames of Object.values(data))
                for (const frame of Object.keys(frames))
                    frameRecord[frame] = true

            if (!expandedUUIDs.has(uuid)) continue

            for (const [property, frames] of Object.entries(data)) {
                const layerFrameList: Record<string, true> = (keyframes[
                    uuid + " " + property
                ] = {})
                for (const frame of Object.keys(frames))
                    layerFrameList[frame] = true
            }
        }
        setTimelineKeyframeEntries(Object.entries(keyframes))
    }, [getTimelineExpandedUUIDs, getTimelineData])
})

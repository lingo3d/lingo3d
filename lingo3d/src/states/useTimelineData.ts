import store, { createEffect } from "@lincode/reactivity"
import { uuidMap } from "../api/core/collections"
import { getTimelineFrame } from "./useTimelineFrame"
import { merge, unset } from "@lincode/utils"
import { onTimelineClearKeyframe } from "../events/onTimelineClearKeyframe"
import { getTimelineLayer } from "./useTimelineLayer"
import { AnimationData } from "../interface/IAnimationManager"
import { getTimeline } from "./useTimeline"
import { onDispose } from "../events/onDispose"
import unsafeGetValue from "../utils/unsafeGetValue"
import getPrivateValue from "../utils/getPrivateValue"
import { keyframesPtr } from "./useTimelineKeyframeEntries"
import { getTimelineRecord } from "./useTimelineRecord"
import { onEditorChanges } from "../events/onEditorChanges"

const [setTimelineData, getTimelineData] = store<[AnimationData | undefined]>([
    undefined
])
export { getTimelineData }

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return

    const handle = getPrivateValue(timeline, "dataState").get(setTimelineData)
    return () => {
        handle.cancel()
        setTimelineData([undefined])
    }
}, [getTimeline])

createEffect(() => {
    const [timelineData] = getTimelineData()
    const timeline = getTimeline()
    if (!timelineData || !timeline || !getTimelineRecord()) return

    const timelineInstances = new WeakSet(
        Object.keys(timelineData).map((uuid) => uuidMap.get(uuid)!)
    )

    const handle0 = onEditorChanges((changes) => {
        const changeData: AnimationData = {}
        const frame = getTimelineFrame()
        const [keyframes] = keyframesPtr
        for (const [instance, changedProperties] of changes) {
            if (!timelineInstances.has(instance)) continue

            const { uuid } = instance
            const uuidData = timelineData[uuid]
            const keyframeNums = Object.keys(keyframes[uuid]).map(Number)
            for (const [property, saved] of changedProperties) {
                let prevFrame = 0
                let nextFrame = frame
                for (const frameNum of keyframeNums) {
                    if (frameNum > frame) {
                        nextFrame = frameNum
                        break
                    }
                    if (frameNum < frame) prevFrame = frameNum
                }
                const propertyData = uuidData[property] ?? {}
                merge(changeData, {
                    [uuid]: {
                        [property]: {
                            [prevFrame]: propertyData[prevFrame] ?? saved,
                            [nextFrame]: propertyData[nextFrame] ?? saved,
                            [frame]: unsafeGetValue(instance, property)
                        }
                    }
                })
            }
        }
        Object.keys(changeData) && timeline.mergeData(changeData)
    })

    const handle1 = onDispose((item) => {
        if (!timelineInstances.has(item)) return
        delete timelineData[item.uuid]
        timeline.data = timelineData
    })

    return () => {
        handle0.cancel()
        handle1.cancel()
    }
}, [getTimelineData, getTimelineRecord])

export const processKeyframe = (
    cb: (
        timelineData: AnimationData,
        uuid: string,
        property: string,
        frame: string
    ) => void,
    skipRefresh?: boolean
) => {
    const [timelineData] = getTimelineData()
    const timeline = getTimeline()
    if (!timelineData || !timeline) return

    const layer = getTimelineLayer()!
    const frame = getTimelineFrame() + ""
    const path = layer.split(" ")

    if (path.length === 1)
        for (const property of Object.keys(timelineData[layer]))
            cb(timelineData, layer, property, frame)
    else cb(timelineData, path[0], path[1], frame)

    if (!skipRefresh) timeline.data = timelineData
}

onTimelineClearKeyframe(() =>
    processKeyframe((timelineData, uuid, property, frame) =>
        unset(timelineData, [uuid, property, frame])
    )
)

import preactStore from "../utils/preactStore"
import { createEffect } from "@lincode/reactivity"
import Appendable from "../../api/core/Appendable"
import { uuidMap } from "../../api/core/collections"
import { onTransformControls } from "../../events/onTransformControls"
import { getTimelineFrame } from "./useTimelineFrame"
import { forceGet, merge, unset } from "@lincode/utils"
import { onTimelineClearKeyframe } from "../../events/onTimelineClearKeyframe"
import { getTimelineLayer } from "./useTimelineLayer"
import { onEditorEdit } from "../../events/onEditorEdit"
import { AnimationData } from "../../interface/IAnimationManager"
import { getTimeline } from "./useTimeline"
import { onDispose } from "../../events/onDispose"
import unsafeGetValue from "../../utils/unsafeGetValue"

const [useTimelineData, setTimelineData, getTimelineData] = preactStore<
    [AnimationData | undefined]
>([undefined])
export { useTimelineData }

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return

    const handle = unsafeGetValue(timeline, "dataState").get(setTimelineData)
    return () => {
        handle.cancel()
        setTimelineData([undefined])
    }
}, [getTimeline])

const timelinePropertiesMap = new WeakMap<Appendable, Array<string>>()
const getTimelineProperties = (instance: Appendable) =>
    forceGet(
        timelinePropertiesMap,
        unsafeGetValue(instance, "constructor"),
        () => {
            const result: Array<string> = []
            for (const [property, type] of Object.entries(
                unsafeGetValue(instance.constructor, "schema")
            ))
                type === Number &&
                    property !== "rotation" &&
                    property !== "scale" &&
                    result.push(property)

            return result
        }
    )

const saveMap = new WeakMap<Appendable, Record<string, number>>()
const saveProperties = (instance: Appendable) => {
    const saved: Record<string, number> = {}
    for (const property of getTimelineProperties(instance))
        saved[property] = unsafeGetValue(instance, property)
    saveMap.set(instance, saved)
}
const diffProperties = (instance: Appendable) => {
    const changed: Array<[string, number]> = []
    const saved = saveMap.get(instance)!
    for (const property of getTimelineProperties(instance))
        if (saved[property] !== unsafeGetValue(instance, property))
            changed.push([property, saved[property]])
    return changed
}

createEffect(() => {
    const [timelineData] = getTimelineData()
    const timeline = getTimeline()
    if (!timelineData || !timeline) return

    const instances = new Set(
        Object.keys(timelineData).map((uuid) => uuidMap.get(uuid)!)
    )
    const handleStart = () => {
        for (const instance of instances) saveProperties(instance)
    }
    const handleFinish = () => {
        const changeData: AnimationData = {}
        for (const instance of instances)
            for (const [property, value] of diffProperties(instance))
                merge(changeData, {
                    [instance.uuid]: {
                        [property]: {
                            0:
                                timelineData[instance.uuid][property]?.[0] ??
                                value,
                            [getTimelineFrame()]: unsafeGetValue(
                                instance,
                                property
                            )
                        }
                    }
                })
        Object.keys(changeData) && timeline.mergeData(changeData)
    }

    const handle0 = onTransformControls((val) => {
        if (val === "start") handleStart()
        else if (val === "stop") handleFinish()
    })
    const handle1 = onEditorEdit((val) => {
        if (val === "start") handleStart()
        else if (val === "stop") handleFinish()
    })

    const handle2 = onDispose(() => {})

    return () => {
        handle0.cancel()
        handle1.cancel()
        handle2.cancel()
    }
}, [getTimelineData])

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

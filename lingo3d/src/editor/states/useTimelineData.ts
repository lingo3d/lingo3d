import preactStore from "../utils/preactStore"
import { AnimationData } from "../../api/serializer/types"
import { createEffect } from "@lincode/reactivity"
import { getTimeline } from "../../states/useTimeline"
import Appendable from "../../api/core/Appendable"
import { uuidMap } from "../../api/core/collections"
import { onTransformControls } from "../../events/onTransformControls"
import { getTimelineFrame } from "./useTimelineFrame"
import { forceGet, merge, unset } from "@lincode/utils"
import { onTimelineClearKeyframe } from "../../events/onTimelineClearKeyframe"
import { getTimelineLayer } from "./useTimelineLayer"

const [useTimelineData, setTimelineData, getTimelineData] = preactStore<
    [AnimationData | undefined]
>([undefined])
export { useTimelineData }

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return

    //@ts-ignore
    const handle = timeline.dataState.get(setTimelineData)
    return () => {
        handle.cancel()
        setTimelineData([undefined])
    }
}, [getTimeline])

const timelinePropertiesMap = new WeakMap<Appendable, Array<string>>()
const getTimelineProperties = (instance: any) =>
    forceGet(timelinePropertiesMap, instance.constructor, () => {
        const result: Array<string> = []
        for (const [property, type] of Object.entries(
            instance.constructor.schema
        ))
            type === Number &&
                property !== "rotation" &&
                property !== "scale" &&
                result.push(property)

        return result
    })

const saveMap = new WeakMap<Appendable, Record<string, number>>()
const saveProperties = (instance: any) => {
    const saved: Record<string, number> = {}
    for (const property of getTimelineProperties(instance))
        saved[property] = instance[property]
    saveMap.set(instance, saved)
}
const diffProperties = (instance: any) => {
    const changed: Array<[string, number]> = []
    const saved = saveMap.get(instance)!
    for (const property of getTimelineProperties(instance))
        if (saved[property] !== instance[property])
            changed.push([property, saved[property]])
    return changed
}

createEffect(() => {
    const [timelineData] = getTimelineData()
    const timeline = getTimeline()
    if (!timelineData || !timeline) return

    const instances: Array<any> = Object.keys(timelineData).map(
        (uuid) => uuidMap.get(uuid)!
    )
    const handle = onTransformControls((val) => {
        if (val === "start") {
            for (const instance of instances) saveProperties(instance)
            return
        }
        if (val !== "stop") return

        const changeData: AnimationData = {}
        for (const instance of instances)
            for (const [property, value] of diffProperties(instance))
                merge(changeData, {
                    [instance.uuid]: {
                        [property]: {
                            0:
                                timelineData[instance.uuid][property]?.[0] ??
                                value,
                            [getTimelineFrame()]: instance[property]
                        }
                    }
                })
        Object.keys(changeData) && timeline.mergeData(changeData)
    })

    return () => {
        handle.cancel()
    }
}, [getTimelineData])

onTimelineClearKeyframe(() => {
    const [timelineData] = getTimelineData()
    const timeline = getTimeline()
    if (!timelineData || !timeline) return

    const frame = getTimelineFrame() + ""
    if (frame === "0") return

    const layer = getTimelineLayer()!
    const path = layer.split(" ")

    if (path.length === 1)
        for (const property of Object.keys(timelineData[layer]))
            unset(timelineData, [layer, property, frame])
    else {
        path.push(frame)
        unset(timelineData, path)
    }
    timeline.data = timelineData
})

import store, { createEffect } from "@lincode/reactivity"
import { merge, unset } from "@lincode/utils"
import { onTimelineClearKeyframe } from "../events/onTimelineClearKeyframe"
import { getTimelineLayer } from "./useTimelineLayer"
import { AnimationData, FrameValue } from "../interface/IAnimationManager"
import { getTimeline } from "./useTimeline"
import { getTimelineRecord } from "./useTimelineRecord"
import { uuidMap } from "../collections/idCollections"
import getReactive from "../utils/getReactive"
import { onTransformControls } from "../events/onTransformControls"
import { onEditorEdit } from "../events/onEditorEdit"
import { timelineDataPtr } from "../pointers/timelineDataPtr"
import {
    addDisposeTimelineInstanceSystem,
    deleteDisposeTimelineInstanceSystem
} from "../systems/eventSystems/disposeTimelineInstanceSystem"
import { timelinePtr } from "../pointers/timelinePtr"
import getTransformControlsData from "../display/utils/getTransformControlsData"
import { timelineFramePtr } from "../pointers/timelineFramePtr"
import getAllSelectionTargets from "../throttle/getAllSelectionTargets"
import Appendable from "../display/core/Appendable"
import { flushMultipleSelectionTargets } from "./useMultipleSelectionTargets"
import { keyframesPtr } from "../pointers/keyframesPtr"
import unsafeGetValue from "../utils/unsafeGetValue"

const [setTimelineData, getTimelineData] = store<[AnimationData | undefined]>([
    undefined
])
export { getTimelineData }

getTimelineData(([val]) => (timelineDataPtr[0] = val))

createEffect(() => {
    const [timeline] = timelinePtr
    if (!timeline) return

    const handle = getReactive(timeline, "data").get((data) =>
        setTimelineData([data])
    )
    return () => {
        handle.cancel()
        setTimelineData([undefined])
    }
}, [getTimeline])

//property name, from value, to value
type ChangedProperties = Array<[string, FrameValue, FrameValue]>

const diffObjects = (prev: Record<string, any>, next: Record<string, any>) => {
    const diff: Record<string, any> = {}
    for (const [k, v] of Object.entries(next)) if (v !== prev[k]) diff[k] = v
    return diff
}

createEffect(() => {
    const [timelineData] = timelineDataPtr
    const [timeline] = timelinePtr
    if (!timelineData || !timeline || !getTimelineRecord()) return

    const timelineInstances = new WeakSet(
        Object.keys(timelineData).map((uuid) => uuidMap.get(uuid)!)
    )

    const prevMap = new WeakMap<Appendable, Record<string, any>>()
    const handle0 = onTransformControls((phase) => {
        if (phase === "start") {
            flushMultipleSelectionTargets(() => {
                for (const instance of getAllSelectionTargets()) {
                    if (!timelineInstances.has(instance)) continue
                    prevMap.set(instance, getTransformControlsData(instance)!)
                }
            })
            return
        }
        flushMultipleSelectionTargets(() => {
            const changeData: AnimationData = {}
            const [frame] = timelineFramePtr
            const [keyframes] = keyframesPtr
            for (const instance of getAllSelectionTargets()) {
                if (!timelineInstances.has(instance)) continue
                const diff = diffObjects(
                    prevMap.get(instance)!,
                    getTransformControlsData(instance)!
                )
                const { uuid } = instance
                const uuidData = timelineData[uuid]
                const keyframeNums = Object.keys(keyframes[uuid]).map(Number)
                for (const [property, saved] of Object.entries(diff)) {
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
            timeline.mergeData(changeData)
            console.log(timeline.data)
        })
    })
    const handle1 = onEditorEdit(({ phase, value, key }) => {})

    addDisposeTimelineInstanceSystem(timelineInstances)

    return () => {
        handle0.cancel()
        handle1.cancel()
        deleteDisposeTimelineInstanceSystem(timelineInstances)
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
    const [timelineData] = timelineDataPtr
    const [timeline] = timelinePtr
    if (!timelineData || !timeline) return

    const layer = getTimelineLayer()!
    const frame = timelineFramePtr[0] + ""
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

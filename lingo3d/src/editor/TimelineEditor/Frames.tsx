import store, { createEffect } from "@lincode/reactivity"
import { forceGet, merge } from "@lincode/utils"
import { useEffect, useMemo } from "preact/hooks"
import Appendable from "../../api/core/Appendable"
import { uuidMap } from "../../api/core/collections"
import { AnimationData } from "../../api/serializer/types"
import { onBeforeRender } from "../../events/onBeforeRender"
import { onTransformControls } from "../../events/onTransformControls"
import { FRAME_HEIGHT } from "../../globals"
import { getTimeline } from "../../states/useTimeline"
import VirtualizedList from "../component/VirtualizedList"
import useResizeObserver from "../hooks/useResizeObserver"
import { useTimeline } from "../states"
import { useTimelineExpandedUUIDs } from "../states/useTimelineExpandedUUIDs"
import { getTimelineFrame, setTimelineFrame } from "../states/useTimelineFrame"
import FrameRow from "./FrameRow"
import { useTimelineData } from "../states/useTimelineData"

let skip = false
createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return
    if (skip) {
        skip = false
        return
    }
    timeline.frame = getTimelineFrame()
}, [getTimelineFrame, getTimeline])

const [setPaused, getPaused] = store(false)

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return

    //@ts-ignore
    const handle = timeline.pausedState.get(setPaused)
    return () => {
        handle.cancel()
    }
}, [getTimeline, getPaused])

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline || getPaused()) return

    const handle = onBeforeRender(() => {
        skip = true
        const { frame } = timeline
        setTimelineFrame(frame)
        if (frame >= timeline.totalFrames) timeline.paused = true
    })
    return () => {
        handle.cancel()
        skip = false
    }
}, [getTimeline, getPaused])

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

const Frames = () => {
    const [ref, { width, height }] = useResizeObserver()
    const [expandedUUIDsWrapper] = useTimelineExpandedUUIDs()
    const [expandedUUIDs] = expandedUUIDsWrapper
    const [timeline] = useTimeline()
    const [timelineDataWrapper] = useTimelineData()

    const keyframesEntries = useMemo(() => {
        const [timelineData] = timelineDataWrapper
        if (!timelineData) return []

        const keyframes: Record<string, Set<number>> = {}
        for (const [uuid, data] of Object.entries(timelineData)) {
            const frameList = (keyframes[uuid] = new Set<number>())
            for (const frames of Object.values(data))
                for (const frame of Object.keys(frames))
                    frameList.add(Number(frame))

            if (!expandedUUIDs.has(uuid)) continue

            for (const [property, frames] of Object.entries(data)) {
                const layerFrameList = (keyframes[uuid + " " + property] =
                    new Set<number>())
                for (const frame of Object.keys(frames))
                    layerFrameList.add(Number(frame))
            }
        }
        return Object.entries(keyframes)
    }, [expandedUUIDsWrapper, timelineDataWrapper])

    useEffect(() => {
        const [timelineData] = timelineDataWrapper
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
                                    timelineData[instance.uuid][
                                        property
                                    ]?.[0] ?? value,
                                [getTimelineFrame()]: instance[property]
                            }
                        }
                    })
            Object.keys(changeData) && timeline.mergeData(changeData)
        })

        return () => {
            handle.cancel()
        }
    }, [timelineDataWrapper])

    return (
        <div ref={ref} className="lingo3d-absfull">
            <VirtualizedList
                data={keyframesEntries}
                itemHeight={FRAME_HEIGHT}
                containerWidth={width}
                containerHeight={height}
                style={{ overflowY: "hidden" }}
                renderItem={({ index, style, data: [layer, keyframes] }) => (
                    <FrameRow
                        key={index}
                        width={width}
                        style={style}
                        layer={layer}
                        keyframes={keyframes}
                    />
                )}
            />
        </div>
    )
}

export default Frames

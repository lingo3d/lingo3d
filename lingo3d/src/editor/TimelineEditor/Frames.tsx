import store, { createEffect } from "@lincode/reactivity"
import { merge } from "@lincode/utils"
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

const valuePrevMap = new WeakMap<Appendable, number>()

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline || getPaused()) return

    const handle = onBeforeRender(() => {
        const { frame } = timeline
        skip = true
        setTimelineFrame(frame)
        if (frame >= timeline.totalFrames) timeline.paused = true
    })
    return () => {
        handle.cancel()
    }
}, [getTimeline, getPaused])

const Frames = () => {
    const [ref, { width, height }] = useResizeObserver()
    const [expandedUUIDsWrapper] = useTimelineExpandedUUIDs()
    const [expandedUUIDs] = expandedUUIDsWrapper
    const [timeline] = useTimeline()

    const keyframesEntries = useMemo(() => {
        if (!timeline?.data) return []

        const keyframes: Record<string, Set<number>> = {}
        for (const [uuid, data] of Object.entries(timeline.data)) {
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
    }, [expandedUUIDsWrapper, timeline])

    useEffect(() => {
        if (!timeline?.data) return

        const properties: Array<[any, string]> = []
        for (const [uuid, data] of Object.entries(timeline.data)) {
            const instance = uuidMap.get(uuid)
            for (const property of Object.keys(data))
                properties.push([instance, property])
        }

        const handle = onTransformControls((val) => {
            if (val === "start") {
                for (const [instance, property] of properties)
                    valuePrevMap.set(instance, instance[property])
                return
            }
            if (val !== "stop") return

            const changeData: AnimationData = {}
            for (const [instance, property] of properties) {
                if (valuePrevMap.get(instance) === instance[property]) continue
                merge(changeData, {
                    [instance.uuid]: {
                        [property]: {
                            [getTimelineFrame()]: instance[property]
                        }
                    }
                })
            }
            console.log(JSON.stringify(timeline.data))
            timeline.mergeData(changeData)
            console.log(JSON.stringify(timeline.data))
        })

        return () => {
            handle.cancel()
        }
    }, [timeline])

    return (
        <div ref={ref} className="lingo3d-absfull">
            <VirtualizedList
                data={keyframesEntries}
                itemHeight={FRAME_HEIGHT}
                containerWidth={width}
                containerHeight={height}
                style={{ overflowY: "hidden" }}
                renderItem={({ index, style, data: [layer, frames] }) => (
                    <FrameRow
                        key={index}
                        width={width}
                        style={style}
                        layer={layer}
                        frames={frames}
                    />
                )}
            />
        </div>
    )
}

export default Frames

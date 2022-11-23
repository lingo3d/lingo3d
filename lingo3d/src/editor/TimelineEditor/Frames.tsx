import store, { createEffect } from "@lincode/reactivity"
import { useMemo } from "preact/hooks"
import { onBeforeRender } from "../../events/onBeforeRender"
import { FRAME_HEIGHT } from "../../globals"
import { getTimeline } from "../../states/useTimeline"
import VirtualizedList from "../component/VirtualizedList"
import useResizeObserver from "../hooks/useResizeObserver"
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

const Frames = () => {
    const [ref, { width, height }] = useResizeObserver()
    const [expandedUUIDsWrapper] = useTimelineExpandedUUIDs()
    const [expandedUUIDs] = expandedUUIDsWrapper
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

import { createEffect } from "@lincode/reactivity"
import { useMemo } from "preact/hooks"
import { onBeforeRender } from "../../events/onBeforeRender"
import { FRAME_HEIGHT } from "../../globals"
import VirtualizedList from "../component/VirtualizedList"
import useResizeObserver from "../hooks/useResizeObserver"
import { useTimelineExpandedUUIDs } from "../states/useTimelineExpandedUUIDs"
import { setTimelineFrame } from "../states/useTimelineFrame"
import FrameRow from "./FrameRow"
import { useTimelineData } from "../states/useTimelineData"
import { getTimelinePaused } from "../states/useTimelinePaused"
import { getTimeline } from "../states/useTimeline"
import FrameTweens from "./FrameTweens"
import { uuidMap } from "../../api/core/collections"
import TimelineAudio from "../../display/TimelineAudio"

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline || getTimelinePaused()) return

    const handle = onBeforeRender(() => {
        let { frame, totalFrames } = timeline
        if (frame >= totalFrames) {
            frame = timeline.frame = totalFrames
            timeline.paused = true
        }
        setTimelineFrame(frame)
    })
    return () => {
        handle.cancel()
    }
}, [getTimeline, getTimelinePaused])

const Frames = () => {
    const [ref, { width, height }] = useResizeObserver()
    const [expandedUUIDsWrapper] = useTimelineExpandedUUIDs()
    const [expandedUUIDs] = expandedUUIDsWrapper
    const [timelineDataWrapper] = useTimelineData()

    const keyframesEntries = useMemo(() => {
        const [timelineData] = timelineDataWrapper
        if (!timelineData) return []

        const keyframes: Record<string, Record<number, true>> = {}
        for (const [uuid, data] of Object.entries(timelineData)) {
            const instance = uuidMap.get(uuid)
            if (instance instanceof TimelineAudio && !("startFrame" in data))
                data.startFrame = { 0: 0 }

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
        return Object.entries(keyframes)
    }, [expandedUUIDsWrapper, timelineDataWrapper])

    return (
        <div
            ref={ref}
            className="lingo3d-absfull"
            style={{ overflow: "hidden" }}
        >
            <FrameTweens keyframesEntries={keyframesEntries} />
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

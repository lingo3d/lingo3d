import { useMemo } from "preact/hooks"
import { FRAME_HEIGHT } from "../../globals"
import VirtualizedList from "../component/VirtualizedList"
import useResizeObserver from "../hooks/useResizeObserver"
import { useTimeline, useTimelineExpandedUUIDs } from "../states"
import FrameRow from "./FrameRow"

type FrameGridProps = {}

const Frames = ({}: FrameGridProps) => {
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
                for (const [frame] of frames) frameList.add(frame)

            if (!expandedUUIDs.has(uuid)) continue

            for (const [property, frames] of Object.entries(data)) {
                const propertyFrameList = (keyframes[uuid + " " + property] =
                    new Set<number>())
                for (const [frame] of frames) propertyFrameList.add(frame)
            }
        }
        return Object.entries(keyframes)
    }, [expandedUUIDsWrapper])

    return (
        <div ref={ref} className="lingo3d-absfull">
            <VirtualizedList
                data={keyframesEntries}
                itemHeight={FRAME_HEIGHT}
                containerWidth={width}
                containerHeight={height}
                renderItem={({ index, style, data: [property, frames] }) => (
                    <FrameRow
                        key={index}
                        width={width}
                        style={style}
                        property={property}
                        frames={frames}
                    />
                )}
            />
        </div>
    )
}

export default Frames

import { dedupe } from "@lincode/utils"
import { useMemo } from "preact/hooks"
import { LAYER_HEIGHT } from "../../globals"
import VirtualizedList from "../component/VirtualizedList"
import useResizeObserver from "../hooks/useResizeObserver"
import { useTimeline, useTimelineExpandedUUIDs } from "../states"
import FrameGrid from "./FrameGrid"

type FrameGridProps = {}

const Frames = ({}: FrameGridProps) => {
    const [ref, { width, height }] = useResizeObserver()
    const [expandedUUIDsWrapper] = useTimelineExpandedUUIDs()
    const [expandedUUIDs] = expandedUUIDsWrapper
    const [timeline] = useTimeline()

    const keyframes = useMemo(() => {
        if (!timeline?.data) return {}

        const keyframes: Record<string, Array<number>> = {}
        for (const [uuid, data] of Object.entries(timeline.data)) {
            const frameList: Array<number> = []
            for (const frames of Object.values(data))
                for (const [frame] of frames) frameList.push(frame)

            keyframes[uuid] = dedupe(frameList)

            if (!expandedUUIDs.has(uuid)) continue

            for (const [property, frames] of Object.entries(data)) {
                const propertyFrameList: Array<number> = (keyframes[
                    uuid + " " + property
                ] = [])
                for (const [frame] of frames) propertyFrameList.push(frame)
            }
        }
        return keyframes
    }, [expandedUUIDsWrapper])

    return (
        <div ref={ref} className="lingo3d-absfull">
            <VirtualizedList
                data={Object.entries(keyframes)}
                itemHeight={LAYER_HEIGHT}
                containerWidth={width}
                containerHeight={height}
                renderItem={({ index, style, data: [property, frames] }) => (
                    <FrameGrid
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

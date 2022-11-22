import { useEffect, useMemo } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import { FRAME_HEIGHT, MONITOR_INTERVAL } from "../../globals"
import VirtualizedList from "../component/VirtualizedList"
import useResizeObserver from "../hooks/useResizeObserver"
import { useTimeline } from "../states"
import { useTimelineExpandedUUIDs } from "../states/useTimelineExpandedUUIDs"
import FrameRow from "./FrameRow"

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
        const interval = setInterval(() => {
            for (const [instance, property] of properties) {
                const { userData } = instance.outerObject3d
                const val = instance[property]
                const propertyOld = property + "_old"
                const changed = userData[propertyOld]
                    ? val !== userData[propertyOld]
                    : false
                userData[propertyOld] = val

                // timeline.assignData({
                //     [instance.uuid]: {
                //         [property]:
                //     }
                // })

                // if (changed) {
                //     console.log("lol")
                // }
            }
        }, MONITOR_INTERVAL)

        for (const [uuid, data] of Object.entries(timeline.data)) {
            const instance = uuidMap.get(uuid) as any
            for (const property of Object.keys(data))
                properties.push([instance, property])
        }
        return () => {
            clearInterval(interval)
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

import useResizeObserver from "../hooks/useResizeObserver"
import { useTimeline, useTimelineExpandedUUIDs } from "../states"
import FrameGrid from "./FrameGrid"

type FrameGridProps = {}

const Frames = ({}: FrameGridProps) => {
    const [ref, { width }] = useResizeObserver()
    const [[expandedUUIDs]] = useTimelineExpandedUUIDs()
    const [timeline] = useTimeline()

    return (
        <div
            ref={ref}
            className="lingo3d-absfull"
            style={{
                display: "flex",
                flexDirection: "column",
                borderTop: "1px solid rgba(255, 255, 255, 0.2)"
            }}
        >
            {timeline?.data &&
                Object.entries(timeline.data).map(([uuid, data]) => (
                    <>
                        <FrameGrid width={width} />
                        {expandedUUIDs.has(uuid) &&
                            Object.entries(data).map(([property, frames]) => (
                                <FrameGrid width={width} />
                            ))}
                    </>
                ))}
        </div>
    )
}

export default Frames

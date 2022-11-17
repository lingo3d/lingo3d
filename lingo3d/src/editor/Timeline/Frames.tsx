import { LAYER_HEIGHT } from "../../globals"
import VirtualizedList from "../component/VirtualizedList"
import useResizeObserver from "../hooks/useResizeObserver"
import { useTimeline, useTimelineExpandedUUIDs } from "../states"
import FrameGrid from "./FrameGrid"

type FrameGridProps = {}

const Frames = ({}: FrameGridProps) => {
    const [ref, { width, height }] = useResizeObserver()
    const [[expandedUUIDs]] = useTimelineExpandedUUIDs()
    const [timeline] = useTimeline()

    // const frameGrids = timeline?.data &&
    //     Object.entries(timeline.data).map(([uuid, data]) => (
    //         <>
    //             <FrameGrid width={width} />
    //             {expandedUUIDs.has(uuid) &&
    //                 Object.entries(data).map(([property, frames]) => (
    //                     <FrameGrid width={width} />
    //                 ))}
    //         </>
    //     ))

    return (
        <div ref={ref} className="lingo3d-absfull">
            <VirtualizedList
                itemNum={100}
                itemHeight={LAYER_HEIGHT}
                containerWidth={width}
                containerHeight={height}
                renderItem={({ index, style }) => <FrameGrid key={index} width={width} style={style} />}
            />
        </div>
    )
}

export default Frames

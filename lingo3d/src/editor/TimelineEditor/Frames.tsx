import { FRAME_HEIGHT } from "../../globals"
import VirtualizedList from "../component/VirtualizedList"
import useResizeObserver from "../hooks/useResizeObserver"
import { useTimelineKeyframeEntries } from "../states/useTimelineKeyframeEntries"
import FrameRow from "./FrameRow"
import FrameTweens from "./FrameTweens"

const Frames = () => {
    const [ref, { width, height }] = useResizeObserver()
    const [keyframesEntries] = useTimelineKeyframeEntries()

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

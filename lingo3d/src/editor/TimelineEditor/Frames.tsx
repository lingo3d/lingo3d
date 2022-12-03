import { FRAME_HEIGHT } from "../../globals"
import VirtualizedList from "../component/VirtualizedList"
import useResizeObserver from "../hooks/useResizeObserver"
import useSyncState from "../hooks/useSyncState"
import { getTimelineKeyframeEntries } from "../../states/useTimelineKeyframeEntries"
import FrameRow from "./FrameRow"
import FrameTweens from "./FrameTweens"
import { useMemo } from "preact/hooks"
import { CSSProperties, memo } from "preact/compat"
import { valueof } from "@lincode/utils"
import diffProps from "../utils/diffProps"

const Frames = () => {
    const [ref, { width, height }] = useResizeObserver()
    const keyframesEntries = useSyncState(getTimelineKeyframeEntries)

    const RenderComponent = useMemo(
        () =>
            memo(
                ({
                    index,
                    style,
                    data: [layer, keyframes]
                }: {
                    index: number
                    style: CSSProperties
                    data: valueof<typeof keyframesEntries>
                }) => {
                    return (
                        <FrameRow
                            key={index}
                            width={width}
                            style={style}
                            layer={layer}
                            keyframes={keyframes}
                        />
                    )
                },
                diffProps
            ),
        [width]
    )

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
                RenderComponent={RenderComponent}
            />
        </div>
    )
}

export default Frames

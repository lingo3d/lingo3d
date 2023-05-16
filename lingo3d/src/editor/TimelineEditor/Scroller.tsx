import { FRAME_HEIGHT, FRAME_MAX, FRAME_WIDTH } from "../../globals"
import { getTimelineExpandedUUIDs } from "../../states/useTimelineExpandedUUIDs"
import { getTimelineKeyframeEntries } from "../../states/useTimelineKeyframeEntries"
import { setTimelineLayer } from "../../states/useTimelineLayer"
import useSyncState from "../hooks/useSyncState"
import handleTreeItemClick from "../utils/handleTreeItemClick"
import FrameGrid from "./FrameGrid"
import FrameIndicator from "./FrameIndicator"
import FrameTweenRow from "./FrameTweenRow"
import { timelineContextMenuSignal } from "./TimelineContextMenu"
import { timelineScrollHeightSignal } from "./timelineScrollHeightSignal"
import { timelineScrollLeftSignal } from "./timelineScrollLeftSignal"
import useSyncScrollTop from "./useSyncScrollTop"
import { uuidMap } from "../../collections/idCollections"
import { timelineDataPtr } from "../../pointers/timelineDataPtr"
import { timelinePtr } from "../../pointers/timelinePtr"
import { timelineScrollerPtr } from "../../pointers/timelineScrollerPtr"
import { setTimelineFrame } from "./setTimelineFrame"
import timelineNeedleSeek from "./timelineNeedleSeek"

const Scroller = () => {
    const scrollRef = useSyncScrollTop()
    const keyframesEntries = useSyncState(getTimelineKeyframeEntries)
    timelineScrollerPtr[0] = scrollRef.current

    return (
        <div
            className="lingo3d-absfull"
            style={{ overflow: "scroll" }}
            ref={scrollRef}
            onScroll={(e) => {
                timelineScrollLeftSignal.value = e.currentTarget.scrollLeft
                timelineNeedleSeek()
            }}
            onMouseDown={(e) => {
                const el = scrollRef.current
                const [timelineData] = timelineDataPtr
                const [expandedUUIDs] = getTimelineExpandedUUIDs()
                if (!el || !timelineData || !timelinePtr[0]) return

                const bounds = el.getBoundingClientRect()
                const relX = e.clientX - bounds.x + el.scrollLeft
                const relY = e.clientY - bounds.y + el.scrollTop

                const testLayerClick = (i: number, layer: string) => {
                    const start = i * FRAME_HEIGHT
                    const end = start + FRAME_HEIGHT
                    if (start > relY || end < relY) {
                        setTimelineLayer(undefined)
                        return false
                    }
                    setTimelineLayer(layer)
                    handleTreeItemClick(e, uuidMap.get(layer.split(" ")[0]))
                    return true
                }
                let i = 0
                loop1: for (const [uuid, data] of Object.entries(
                    timelineData
                )) {
                    if (testLayerClick(i++, uuid)) break
                    if (!expandedUUIDs.has(uuid)) continue
                    for (const property of Object.keys(data))
                        if (testLayerClick(i++, uuid + " " + property))
                            break loop1
                }

                const frame = Math.floor(relX / FRAME_WIDTH)
                setTimelineFrame(frame, {
                    x: frame * FRAME_WIDTH,
                    y: Math.floor(relY / FRAME_HEIGHT) * FRAME_HEIGHT
                })
            }}
            onContextMenu={(e) =>
                (timelineContextMenuSignal.value = {
                    x: e.clientX,
                    y: e.clientY
                })
            }
        >
            <div
                style={{
                    width: FRAME_MAX * FRAME_WIDTH,
                    height: timelineScrollHeightSignal.value,
                    minHeight: "100%"
                }}
            >
                <FrameGrid />
                {keyframesEntries.map(([uuid, frames]) => (
                    <FrameTweenRow key={uuid} uuid={uuid} frames={frames} />
                ))}
                <FrameIndicator />
            </div>
        </div>
    )
}

export default Scroller

import { createEffect } from "@lincode/reactivity"
import { useEffect } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import { onTimelineSeekScrollLeft } from "../../events/onTimelineSeekScrollLeft"
import { FRAME_HEIGHT, FRAME_MAX, FRAME_WIDTH } from "../../globals"
import { getTimeline } from "../../states/useTimeline"
import { setTimelineContextMenu } from "../../states/useTimelineContextMenu"
import { getTimelineData } from "../../states/useTimelineData"
import { getTimelineExpandedUUIDs } from "../../states/useTimelineExpandedUUIDs"
import {
    getTimelineFrame,
    userSetTimelineFrame
} from "../../states/useTimelineFrame"
import { getTimelineKeyframeEntries } from "../../states/useTimelineKeyframeEntries"
import { setTimelineLayer } from "../../states/useTimelineLayer"
import { getTimelinePaused } from "../../states/useTimelinePaused"
import { timelineScrollHeightSignal } from "../../states/useTimelineScrollHeight"
import { timelineScrollLeftSignal } from "../../states/useTimelineScrollLeft"
import useSyncState from "../hooks/useSyncState"
import handleTreeItemClick from "../utils/handleTreeItemClick"
import FrameGrid from "./FrameGrid"
import FrameIndicator, { highlightFrame } from "./FrameIndicator"
import FrameTweenRow from "./FrameTweenRow"
import { framesWidthPtr, maxFramePtr, minFramePtr } from "./Ruler"
import useSyncScrollTop from "./useSyncScrollTop"

const Scroller = () => {
    const scrollRef = useSyncScrollTop()
    const keyframesEntries = useSyncState(getTimelineKeyframeEntries)

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return

        const seek = () => {
            const frameDiv = getTimelineFrame() / 5
            const ceilFrame = Math.ceil(frameDiv) * 5
            const floorFrame = Math.floor(frameDiv) * 5
            if (ceilFrame > maxFramePtr[0])
                el.scrollLeft = floorFrame * FRAME_WIDTH
            else if (floorFrame < minFramePtr[0])
                el.scrollLeft = ceilFrame * FRAME_WIDTH - framesWidthPtr[0]
        }

        const handle = createEffect(() => {
            if (getTimelinePaused()) return

            const frameHandle = getTimelineFrame(seek)
            return () => {
                frameHandle.cancel()
            }
        }, [getTimelinePaused])

        const seekHandle = onTimelineSeekScrollLeft(seek)

        return () => {
            handle.cancel()
            seekHandle.cancel()
        }
    }, [])

    return (
        <div
            className="lingo3d-absfull"
            style={{ overflow: "scroll" }}
            ref={scrollRef}
            onScroll={(e) =>
                (timelineScrollLeftSignal.value = e.currentTarget.scrollLeft)
            }
            onMouseDown={(e) => {
                const el = scrollRef.current
                const [timelineData] = getTimelineData()
                const [expandedUUIDs] = getTimelineExpandedUUIDs()
                const timeline = getTimeline()
                if (!el || !timelineData || !timeline) return

                const bounds = el.getBoundingClientRect()
                const relX = e.clientX - bounds.x + el.scrollLeft
                const relY = e.clientY - bounds.y + el.scrollTop

                const testLayerClick = (i: number, layer: string) => {
                    const start = i * FRAME_HEIGHT
                    const end = start + FRAME_HEIGHT
                    if (start > relY || end < relY) return false
                    setTimelineLayer(layer)
                    handleTreeItemClick(uuidMap.get(layer.split(" ")[0]))
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
                userSetTimelineFrame(frame)
                highlightFrame({
                    x: frame * FRAME_WIDTH,
                    y: Math.floor(relY / FRAME_HEIGHT) * FRAME_HEIGHT
                })
            }}
            onContextMenu={(e) => {
                e.preventDefault()
                setTimelineContextMenu({ x: e.clientX, y: e.clientY })
            }}
        >
            <div
                style={{
                    width: FRAME_MAX * FRAME_WIDTH,
                    height: timelineScrollHeightSignal.value
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

import { FRAME_MAX, FRAME_WIDTH } from "../../globals"
import { timelineScrollHeightSignal } from "../../states/useTimelineScrollHeight"
import { timelineScrollLeftSignal } from "../../states/useTimelineScrollLeft"
import useSyncScrollTop from "./useSyncScrollTop"

const Scroller = () => {
    const scrollRef = useSyncScrollTop()

    return (
        <div
            className="lingo3d-absfull"
            style={{ overflow: "scroll" }}
            ref={scrollRef}
            onScroll={(e) =>
                (timelineScrollLeftSignal.value = e.currentTarget.scrollLeft)
            }
        >
            <div
                style={{
                    width: FRAME_MAX * FRAME_WIDTH,
                    height: timelineScrollHeightSignal.value
                }}
            />
        </div>
    )
}

export default Scroller

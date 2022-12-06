import useSyncState from "../hooks/useSyncState"
import { getTimelineData } from "../../states/useTimelineData"
import LayerTreeItem from "./treeItems/LayerTreeItem"
import PropertyTreeItem from "./treeItems/PropertyTreeItem"
import { timelineScrollHeightSignal } from "../../states/useTimelineScrollHeight"
import useResizeObserver from "../hooks/useResizeObserver"
import useSyncScrollTop from "./useSyncScrollTop"

const TimelineGraph = () => {
    const [timelineData] = useSyncState(getTimelineData)
    const scrollRef = useSyncScrollTop()
    const [ref, { height }] = useResizeObserver()
    timelineScrollHeightSignal.value = height

    return (
        <div
            className="lingo3d-absfull"
            style={{ overflow: "scroll" }}
            ref={scrollRef}
        >
            <div ref={ref}>
                {timelineData &&
                    Object.entries(timelineData).map(([uuid, data]) => (
                        <LayerTreeItem key={uuid} uuid={uuid}>
                            {Object.keys(data).map((property) => (
                                <PropertyTreeItem
                                    key={uuid + " " + property}
                                    property={property}
                                    uuid={uuid}
                                />
                            ))}
                        </LayerTreeItem>
                    ))}
            </div>
        </div>
    )
}

export default TimelineGraph

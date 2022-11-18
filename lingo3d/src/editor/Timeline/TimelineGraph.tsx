import { FRAME_HEIGHT } from "../../globals"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import { useTimeline } from "../states"
import TimelineTreeItem from "./TimelineTreeItem"

const TimelineGraph = () => {
    const [timeline] = useTimeline()

    return (
        <div style={{ overflow: "scroll", width: 200 }}>
            {timeline?.data &&
                Object.entries(timeline.data).map(([uuid, data]) => (
                    <TimelineTreeItem uuid={uuid}>
                        {Object.keys(data).map((property) => (
                            <BaseTreeItem
                                height={FRAME_HEIGHT}
                                label={property}
                            />
                        ))}
                    </TimelineTreeItem>
                ))}
        </div>
    )
}

export default TimelineGraph

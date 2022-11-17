import { uuidMap } from "../../api/core/collections"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import { useTimeline } from "../states"
import getComponentName from "../utils/getComponentName"

const TimelineGraph = () => {
    const [timeline] = useTimeline()

    return (
        <div style={{ overflow: "scroll", width: 200 }}>
            {timeline?.data &&
                Object.entries(timeline.data).map(([uuid, data]) => (
                    <BaseTreeItem label={getComponentName(uuidMap.get(uuid))}>
                        {Object.keys(data).map((property) => (
                            <BaseTreeItem label={property} />
                        ))}
                    </BaseTreeItem>
                ))}
        </div>
    )
}

export default TimelineGraph

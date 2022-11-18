import { FRAME_HEIGHT } from "../../globals"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import { useTimeline, useTimelineSelectedLayer } from "../states"
import LayerTreeItem from "./LayerTreeItem"

const TimelineGraph = () => {
    const [timeline] = useTimeline()
    const [selectedLayer] = useTimelineSelectedLayer()

    return (
        <div style={{ overflow: "scroll", width: 200 }}>
            {timeline?.data &&
                Object.entries(timeline.data).map(([uuid, data]) => (
                    <LayerTreeItem
                        uuid={uuid}
                        selected={selectedLayer === uuid}
                    >
                        {Object.keys(data).map((property) => (
                            <BaseTreeItem
                                height={FRAME_HEIGHT}
                                label={property}
                                selected={
                                    selectedLayer === uuid + " " + property
                                }
                            />
                        ))}
                    </LayerTreeItem>
                ))}
        </div>
    )
}

export default TimelineGraph

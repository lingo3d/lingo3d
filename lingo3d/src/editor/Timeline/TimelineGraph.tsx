import { useTimeline, useTimelineSelectedLayer } from "../states"
import LayerTreeItem from "./LayerTreeItem"
import PropertyTreeItem from "./PropertyTreeItem"

const TimelineGraph = () => {
    const [timeline] = useTimeline()
    const [selectedLayer] = useTimelineSelectedLayer()

    return (
        <div style={{ overflow: "scroll", width: 200 }}>
            {timeline?.data &&
                Object.entries(timeline.data).map(([uuid, data]) => (
                    <LayerTreeItem
                        key={uuid}
                        uuid={uuid}
                        selected={selectedLayer === uuid}
                    >
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
    )
}

export default TimelineGraph

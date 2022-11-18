import { FRAME_HEIGHT } from "../../globals"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import { useTimelineSelectedLayer } from "../states"

type PropertyTreeItemProps = {
    property: string
    uuid: string
}

const PropertyTreeItem = ({ property, uuid }: PropertyTreeItemProps) => {
    const [selectedLayer, setSelectedLayer] = useTimelineSelectedLayer()
    const layer = uuid + " " + property

    return (
        <BaseTreeItem
            height={FRAME_HEIGHT}
            label={property}
            selected={selectedLayer === layer}
            onClick={() => setSelectedLayer(layer)}
        />
    )
}

export default PropertyTreeItem

import { FRAME_HEIGHT } from "../../globals"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import { useTimelineLayer } from "../states"

type PropertyTreeItemProps = {
    property: string
    uuid: string
}

const PropertyTreeItem = ({ property, uuid }: PropertyTreeItemProps) => {
    const [layer, setLayer] = useTimelineLayer()
    const myLayer = uuid + " " + property

    return (
        <BaseTreeItem
            height={FRAME_HEIGHT}
            label={property}
            selected={layer === myLayer}
            onClick={() => setLayer(myLayer)}
        />
    )
}

export default PropertyTreeItem

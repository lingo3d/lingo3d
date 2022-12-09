import { uuidMap } from "../../../api/core/collections"
import { FRAME_HEIGHT } from "../../../globals"
import BaseTreeItem from "../../component/treeItems/BaseTreeItem"
import useSyncState from "../../hooks/useSyncState"
import {
    getTimelineLayer,
    setTimelineLayer
} from "../../../states/useTimelineLayer"
import handleTreeItemClick from "../../utils/handleTreeItemClick"

type PropertyTreeItemProps = {
    property: string
    uuid: string
}

const PropertyTreeItem = ({ property, uuid }: PropertyTreeItemProps) => {
    const layer = useSyncState(getTimelineLayer)
    const myLayer = uuid + " " + property
    const selected = layer === myLayer

    return (
        <BaseTreeItem
            height={FRAME_HEIGHT}
            label={property}
            selected={selected}
            onClick={() => {
                setTimelineLayer(myLayer)
                handleTreeItemClick(uuidMap.get(uuid))
            }}
        />
    )
}

export default PropertyTreeItem

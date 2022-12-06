import { useMemo } from "preact/hooks"
import { uuidMap } from "../../../api/core/collections"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { FRAME_HEIGHT } from "../../../globals"
import BaseTreeItem from "../../component/treeItems/BaseTreeItem"
import useSyncState from "../../hooks/useSyncState"
import {
    getTimelineLayer,
    setTimelineLayer
} from "../../../states/useTimelineLayer"

type PropertyTreeItemProps = {
    property: string
    uuid: string
}

const PropertyTreeItem = ({ property, uuid }: PropertyTreeItemProps) => {
    const layer = useSyncState(getTimelineLayer)
    const myLayer = uuid + " " + property
    const instance = useMemo(() => uuidMap.get(uuid), [uuid])
    const selected = layer === myLayer

    return (
        <BaseTreeItem
            height={FRAME_HEIGHT}
            label={property}
            selected={selected}
            onClick={() => {
                setTimelineLayer(myLayer)
                emitSelectionTarget(instance, false, true)
            }}
        />
    )
}

export default PropertyTreeItem

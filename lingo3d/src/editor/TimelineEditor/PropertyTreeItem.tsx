import { useMemo } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { FRAME_HEIGHT } from "../../globals"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import { useTimelineLayer } from "../states/useTimelineLayer"

type PropertyTreeItemProps = {
    property: string
    uuid: string
}

const PropertyTreeItem = ({ property, uuid }: PropertyTreeItemProps) => {
    const [layer, setLayer] = useTimelineLayer()
    const myLayer = uuid + " " + property
    const instance = useMemo(() => uuidMap.get(uuid), [uuid])

    return (
        <BaseTreeItem
            height={FRAME_HEIGHT}
            label={property}
            selected={layer === myLayer}
            onClick={() => setLayer(myLayer)}
            onSelect={() => emitSelectionTarget(instance, false, true)}
        />
    )
}

export default PropertyTreeItem

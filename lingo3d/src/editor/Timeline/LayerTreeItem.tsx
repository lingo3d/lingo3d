import { ComponentChildren } from "preact"
import { useLayoutEffect } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import { FRAME_HEIGHT } from "../../globals"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import {
    addTimelineExpandedUUID,
    deleteTimelineExpandedUUID,
    useTimelineSelectedLayer
} from "../states"
import getComponentName from "../utils/getComponentName"

type LayerTreeItemProps = {
    children: ComponentChildren
    uuid: string
}

const LayerTreeItem = ({ children, uuid }: LayerTreeItemProps) => {
    const [selectedLayer, setSelectedLayer] = useTimelineSelectedLayer()

    useLayoutEffect(() => {
        return () => {
            deleteTimelineExpandedUUID(uuid)
        }
    }, [])

    return (
        <BaseTreeItem
            height={FRAME_HEIGHT}
            label={getComponentName(uuidMap.get(uuid))}
            onExpand={() => addTimelineExpandedUUID(uuid)}
            onCollapse={() => deleteTimelineExpandedUUID(uuid)}
            selected={selectedLayer === uuid}
            onClick={() => setSelectedLayer(uuid)}
        >
            {children}
        </BaseTreeItem>
    )
}

export default LayerTreeItem

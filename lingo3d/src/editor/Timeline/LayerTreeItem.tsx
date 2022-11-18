import { ComponentChildren } from "preact"
import { useLayoutEffect } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import { FRAME_HEIGHT } from "../../globals"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import { addTimelineExpandedUUID, deleteTimelineExpandedUUID } from "../states"
import getComponentName from "../utils/getComponentName"

type LayerTreeItemProps = {
    children: ComponentChildren
    uuid: string
    selected: boolean
}

const LayerTreeItem = ({ children, uuid, selected }: LayerTreeItemProps) => {
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
            selected={selected}
        >
            {children}
        </BaseTreeItem>
    )
}

export default LayerTreeItem

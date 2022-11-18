import { ComponentChildren } from "preact"
import { useLayoutEffect } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import { FRAME_HEIGHT } from "../../globals"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import { addTimelineExpandedUUID, deleteTimelineExpandedUUID } from "../states"
import getComponentName from "../utils/getComponentName"

type TimelineTreeItemProps = {
    children: ComponentChildren
    uuid: string
}

const TimelineTreeItem = ({ children, uuid }: TimelineTreeItemProps) => {
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
        >
            {children}
        </BaseTreeItem>
    )
}

export default TimelineTreeItem

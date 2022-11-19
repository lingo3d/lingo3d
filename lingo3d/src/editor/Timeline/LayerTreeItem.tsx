import { ComponentChildren } from "preact"
import { useLayoutEffect } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import { FRAME_HEIGHT } from "../../globals"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import {
    addTimelineExpandedUUID,
    deleteTimelineExpandedUUID,
    useTimelineLayer
} from "../states"
import getComponentName from "../utils/getComponentName"

type LayerTreeItemProps = {
    children: ComponentChildren
    uuid: string
}

const LayerTreeItem = ({ children, uuid }: LayerTreeItemProps) => {
    const [layer, setLayer] = useTimelineLayer()

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
            selected={layer === uuid}
            onClick={() => setLayer(uuid)}
        >
            {children}
        </BaseTreeItem>
    )
}

export default LayerTreeItem

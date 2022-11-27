import { ComponentChildren } from "preact"
import { useLayoutEffect, useMemo } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import { FRAME_HEIGHT } from "../../globals"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import {
    deleteTimelineExpandedUUID,
    addTimelineExpandedUUID
} from "../states/useTimelineExpandedUUIDs"
import { useTimelineLayer } from "../states/useTimelineLayer"
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

    const instance = useMemo(() => uuidMap.get(uuid), [uuid])
    if (!instance) return null

    return (
        <BaseTreeItem
            height={FRAME_HEIGHT}
            label={getComponentName(instance)}
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

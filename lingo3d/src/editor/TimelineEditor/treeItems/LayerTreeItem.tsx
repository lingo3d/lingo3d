import { ComponentChildren } from "preact"
import { useLayoutEffect, useMemo, useState } from "preact/hooks"
import { uuidMap } from "../../../api/core/collections"
import { onName } from "../../../events/onName"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { FRAME_HEIGHT } from "../../../globals"
import BaseTreeItem from "../../component/treeItems/BaseTreeItem"
import useSyncState from "../../hooks/useSyncState"
import {
    deleteTimelineExpandedUUID,
    addTimelineExpandedUUID
} from "../../../states/useTimelineExpandedUUIDs"
import {
    getTimelineLayer,
    setTimelineLayer
} from "../../../states/useTimelineLayer"
import getComponentName from "../../utils/getComponentName"

type LayerTreeItemProps = {
    children: ComponentChildren
    uuid: string
}

const LayerTreeItem = ({ children, uuid }: LayerTreeItemProps) => {
    const layer = useSyncState(getTimelineLayer)
    const [name, setName] = useState("")
    const instance = useMemo(() => uuidMap.get(uuid), [uuid])
    const selected = layer === uuid

    useLayoutEffect(() => {
        return () => {
            deleteTimelineExpandedUUID(uuid)
        }
    }, [])

    useLayoutEffect(() => {
        if (!instance) return
        setName(getComponentName(instance))
        const handle = onName(
            (item) => item === instance && setName(getComponentName(instance))
        )
        return () => {
            handle.cancel()
        }
    }, [instance])

    return (
        <BaseTreeItem
            height={FRAME_HEIGHT}
            label={name}
            onExpand={() => addTimelineExpandedUUID(uuid)}
            onCollapse={() => deleteTimelineExpandedUUID(uuid)}
            selected={selected}
            onClick={() => {
                setTimelineLayer(uuid)
                emitSelectionTarget(instance, false, true)
            }}
        >
            {children}
        </BaseTreeItem>
    )
}

export default LayerTreeItem

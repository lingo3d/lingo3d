import { useEffect, useMemo, useState } from "preact/hooks"
import { Bone, Object3D } from "three"
import { TreeItemProps } from "./TreeItem"
import ComponentIcon from "./icons/ComponentIcon"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import BoneIcon from "./icons/BoneIcon"
import useSyncState from "../hooks/useSyncState"
import {
    getSceneGraphExpanded,
    setSceneGraphExpanded
} from "../../states/useSceneGraphExpanded"
import handleTreeItemClick from "../utils/handleTreeItemClick"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getManager } from "../../api/utils/getManager"
import FoundManager from "../../display/core/FoundManager"

type NativeTreeItemProps = Omit<TreeItemProps, "appendable"> & {
    object3d: Object3D | Bone
}

const NativeTreeItem = ({ object3d }: NativeTreeItemProps) => {
    const [expanded, setExpanded] = useState(false)

    const sceneGraphExpanded = useSyncState(getSceneGraphExpanded)
    useEffect(() => {
        sceneGraphExpanded?.has(object3d) && setExpanded(true)
    }, [sceneGraphExpanded])

    const appendable = useMemo(
        () => getManager(object3d) ?? new FoundManager(object3d),
        [object3d]
    )
    const selectionTarget = useSyncState(getSelectionTarget)
    const [multipleSelectionTargets] = useSyncState(getMultipleSelectionTargets)
    const selected =
        selectionTarget === appendable ||
        multipleSelectionTargets.has(appendable)

    const IconComponent = useMemo(() => {
        if ("isBone" in object3d) return BoneIcon
        return ComponentIcon
    }, [object3d])

    return (
        <BaseTreeItem
            label={object3d.name}
            selected={selected}
            draggable
            myDraggingItem={object3d}
            onCollapse={() => setSceneGraphExpanded(undefined)}
            onClick={(e) => handleTreeItemClick(e, appendable)}
            onContextMenu={(e) => handleTreeItemClick(e, appendable, true)}
            expanded={expanded}
            expandable={!!object3d.children.length}
            outlined
            IconComponent={IconComponent}
        >
            {() =>
                object3d.children.map((child) => (
                    <NativeTreeItem key={child.uuid} object3d={child} />
                ))
            }
        </BaseTreeItem>
    )
}

export default NativeTreeItem

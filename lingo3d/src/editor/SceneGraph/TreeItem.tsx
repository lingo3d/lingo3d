import { ComponentChildren } from "preact"
import { useLayoutEffect, useMemo, useState } from "preact/hooks"
import Appendable from "../../api/core/Appendable"
import Model from "../../display/Model"
import ModelTreeItem from "./ModelTreeItem"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { isPositionedItem } from "../../api/core/PositionedItem"
import { Object3D } from "three"
import { setSelectionNativeTarget } from "../../states/useSelectionNativeTarget"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import getComponentName from "../utils/getComponentName"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import CubeIcon from "./icons/CubeIcon"
import { setEditorMode } from "../../states/useEditorMode"
import { hiddenAppendables } from "../../api/core/collections"
import { getEditorPlay } from "../../states/useEditorPlay"
import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import PlayIcon from "./icons/PlayIcon"
import BasicMaterialManager from "../../display/material/BasicMaterialManager"
import ImageIcon from "./icons/ImageIcon"
import { onName } from "../../events/onName"
import useSyncState from "../hooks/useSyncState"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import {
    getSceneGraphExpanded,
    setSceneGraphExpanded
} from "../states/useSceneGraphExpanded"

export type TreeItemProps = {
    appendable: Appendable
    children?: ComponentChildren
    expandable?: boolean
}

export const makeTreeItemCallbacks = (
    target: Appendable | Object3D,
    parent?: Appendable
) => {
    return (rightClick?: boolean) => {
        getEditorPlay() && setEditorMode("translate")
        isPositionedItem(parent) &&
            getSelectionTarget() !== parent &&
            emitSelectionTarget(parent, rightClick)
        if (target instanceof Object3D)
            queueMicrotask(() => setSelectionNativeTarget(target))
        else emitSelectionTarget(target, rightClick)
    }
}

const TreeItem = ({ appendable, children, expandable }: TreeItemProps) => {
    const appendableChildren = useMemo(() => {
        return appendable.children
            ? [...appendable.children].filter(
                  (item) => !hiddenAppendables.has(item)
              )
            : undefined
    }, [appendable.children?.size])

    const selectionTarget = useSyncState(getSelectionTarget)
    const multipleSelectionTargets = useSyncState(getMultipleSelectionTargets)
    const selected =
        selectionTarget === appendable ||
        multipleSelectionTargets.includes(appendable as any)

    const handleClick = useMemo(() => makeTreeItemCallbacks(appendable), [])

    const sceneGraphExpanded = useSyncState(getSceneGraphExpanded)

    const IconComponent = useMemo(() => {
        if (appendable instanceof AnimationManager) return PlayIcon
        if (appendable instanceof BasicMaterialManager) return ImageIcon
        return CubeIcon
    }, [appendable])

    const [name, setName] = useState("")
    useLayoutEffect(() => {
        setName(getComponentName(appendable))
        const handle = onName(
            (item) =>
                item === appendable && setName(getComponentName(appendable))
        )
        return () => {
            handle.cancel()
        }
    }, [appendable])

    return (
        <BaseTreeItem
            label={name}
            selected={selected}
            draggable
            myDraggingItem={appendable}
            onDrop={(draggingItem) => appendable.attach(draggingItem)}
            expanded={sceneGraphExpanded?.has(appendable.outerObject3d)}
            onCollapse={() => setSceneGraphExpanded(undefined)}
            expandable={expandable ?? !!appendableChildren?.length}
            onClick={() => handleClick()}
            onContextMenu={() => handleClick(true)}
            IconComponent={IconComponent}
        >
            {() => (
                <>
                    {appendableChildren?.map((childAppendable) =>
                        childAppendable instanceof Model ? (
                            <ModelTreeItem
                                key={childAppendable.uuid}
                                appendable={childAppendable}
                            />
                        ) : (
                            <TreeItem
                                key={childAppendable.uuid}
                                appendable={childAppendable}
                            />
                        )
                    )}
                    {children}
                </>
            )}
        </BaseTreeItem>
    )
}

export default TreeItem

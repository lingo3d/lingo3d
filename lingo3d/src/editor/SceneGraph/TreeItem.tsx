import { ComponentChildren } from "preact"
import { useLayoutEffect, useMemo, useState } from "preact/hooks"
import Appendable from "../../api/core/Appendable"
import Model from "../../display/Model"
import ModelTreeItem from "./ModelTreeItem"
import getDisplayName from "../utils/getDisplayName"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import CubeIcon from "./icons/CubeIcon"
import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import PlayIcon from "./icons/PlayIcon"
import { setSceneGraphExpanded } from "../../states/useSceneGraphExpanded"
import handleTreeItemClick from "../utils/handleTreeItemClick"
import MeshAppendable from "../../api/core/MeshAppendable"
import { disableSceneGraph } from "../../collections/disableSceneGraph"
import useSelected from "./useSelected"
import useExpanded from "./useExpanded"
import useSceneGraphRefresh from "../hooks/useSceneGraphRefresh"

export type TreeItemProps = {
    appendable: Appendable | MeshAppendable
    children?: ComponentChildren
    expandable?: boolean
}

const TreeItem = ({ appendable, children, expandable }: TreeItemProps) => {
    const refresh = useSceneGraphRefresh()
    const appendableChildren = useMemo(
        () =>
            appendable.children
                ? [...appendable.children].filter(
                      (item) => !disableSceneGraph.has(item)
                  )
                : undefined,
        [refresh]
    )

    const selected = useSelected(appendable)
    const expandedSignal = useExpanded(appendable)

    const IconComponent = useMemo(() => {
        if (appendable instanceof AnimationManager) return PlayIcon
        return CubeIcon
    }, [appendable])

    const [name, setName] = useState("")
    useLayoutEffect(() => {
        setName(getDisplayName(appendable))
        const handle = appendable.events.on("name", () =>
            setName(getDisplayName(appendable))
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
            onDrop={(draggingItem) =>
                "attach" in appendable
                    ? appendable.attach(draggingItem)
                    : appendable.append(draggingItem)
            }
            expandedSignal={expandedSignal}
            onCollapse={() => setSceneGraphExpanded(undefined)}
            expandable={expandable ?? !!appendableChildren?.length}
            onClick={(e) => handleTreeItemClick(e, appendable)}
            onContextMenu={(e) => handleTreeItemClick(e, appendable, true)}
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

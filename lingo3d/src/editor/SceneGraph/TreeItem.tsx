import { Fragment, h } from "preact"
import { useState, useMemo, useContext } from "preact/hooks"
import { preventTreeShake } from "@lincode/utils"
import Appendable, { hiddenAppendables } from "../../api/core/Appendable"
import {
    useMultipleSelectionTargets,
    useSceneGraphExpanded,
    useSceneGraphPreventDrag,
    useSelectionTarget
} from "../states"
import Model from "../../display/Model"
import ModelTreeItem from "./ModelTreeItem"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import useClick from "./useClick"
import { isPositionedItem } from "../../api/core/PositionedItem"
import { Object3D } from "three"
import { setSceneGraphTarget } from "../../states/useSceneGraphTarget"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import getComponentName from "../utils/getComponentName"
import { getEditing } from "../../states/useEditing"
import { setEditorMode } from "../../states/useEditorMode"
import BaseTreeItem, { TreeItemContext } from "../component/BaseTreeItem"

preventTreeShake(h)

export type TreeItemProps = {
    appendable: Appendable
    children?: JSX.Element | Array<JSX.Element>
}

export const makeTreeItemCallbacks = (
    target: Appendable | Object3D,
    parent?: Appendable
) =>
    useClick((e) => {
        e.stopPropagation()
        !getEditing() && setEditorMode("translate")
        isPositionedItem(parent) &&
            getSelectionTarget() !== parent &&
            emitSelectionTarget(parent)
        if (target instanceof Object3D)
            queueMicrotask(() => setSceneGraphTarget(target))
        else emitSelectionTarget(target)
    })

const TreeItem = ({ appendable, children }: TreeItemProps) => {
    const name = getComponentName(appendable)

    const appendableChildren = useMemo(() => {
        return appendable.children
            ? [...appendable.children].filter(
                  (item) => !hiddenAppendables.has(item)
              )
            : undefined
    }, [appendable.children?.size])

    const [dragOver, setDragOver] = useState(false)

    const [selectionTarget] = useSelectionTarget()
    const [multipleSelectionTargets] = useMultipleSelectionTargets()
    const selected =
        selectionTarget === appendable ||
        multipleSelectionTargets.includes(appendable as any)

    const setClickEl = makeTreeItemCallbacks(appendable)

    const [sceneGraphExpanded, setSceneGraphExpanded] = useSceneGraphExpanded()

    const [preventDrag] = useSceneGraphPreventDrag()

    const context = useContext(TreeItemContext)
    const canSetDragOver = () =>
        context.draggingItem && context.draggingItem !== appendable

    return (
        <BaseTreeItem
            ref={setClickEl}
            label={name}
            selected={selected}
            dragOver={dragOver}
            draggable={!preventDrag}
            onDragStart={() => (context.draggingItem = appendable)}
            onDragEnd={() => (context.draggingItem = undefined)}
            onDragOver={() => canSetDragOver() && setDragOver(true)}
            onDragEnter={() => canSetDragOver() && setDragOver(true)}
            onDragLeave={() => canSetDragOver() && setDragOver(false)}
            onDrop={() =>
                canSetDragOver() &&
                (setDragOver(false), appendable.attach(context.draggingItem))
            }
            expanded={sceneGraphExpanded?.has(appendable.outerObject3d)}
            onCollapse={() => setSceneGraphExpanded(undefined)}
            expandable={!!appendableChildren?.length}
        >
            {() => (
                <Fragment>
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
                </Fragment>
            )}
        </BaseTreeItem>
    )
}

export default TreeItem

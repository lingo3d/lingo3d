import { h } from "preact"
import { useState } from "preact/hooks"
import { preventTreeShake, upperFirst } from "@lincode/utils"
import Appendable from "../../api/core/Appendable"
import CubeIcon from "./icons/CubeIcon"
import ExpandIcon from "./icons/ExpandIcon"
import CollapseIcon from "./icons/CollapseIcon"
import { useMultipleSelectionTargets, useSelectionTarget } from "../states"
import { emitEditorCenterView } from "../../events/onEditorCenterView"
import SimpleObjectManager from "../../display/core/SimpleObjectManager"
import Model from "../../display/Model"
import ModelTreeItem from "./ModelTreeItem"
import { emitSelectionTarget } from "../../events/onSelectionTarget"

preventTreeShake(h)

export type TreeItemProps = {
    appendable: Appendable
    level: number
    children?: JSX.Element | Array<JSX.Element>
}

export const makeTreeItemCallbacks = (appendable?: Appendable) => {
    const handleMouseDown = (e: MouseEvent) => {
        e.stopPropagation()
        appendable instanceof SimpleObjectManager && emitSelectionTarget(appendable)
    }

    const handleClick = (e: MouseEvent) => e.stopPropagation()

    const handleDoubleClick = (e: MouseEvent) => {
        e.stopPropagation()
        appendable instanceof SimpleObjectManager && emitEditorCenterView(appendable)
    }
    
    return { handleMouseDown, handleClick, handleDoubleClick }
}

const TreeItem = ({ appendable, level, children }: TreeItemProps) => {
    //@ts-ignore
    const name = appendable.name || upperFirst(appendable.constructor.componentName)
    const appendableChildren = appendable.children ? [...appendable.children] : undefined
    const expandIconStyle = { opacity: (appendableChildren?.length || children) ? 0.5 : 0.05, cursor: "pointer" }

    const [expanded, setExpanded] = useState(false)
    // const [expanded, setExpanded] = useState(!!appendableChildren?.length)
    
    const [selectionTarget] = useSelectionTarget()
    const [multipleSelectionTargets] = useMultipleSelectionTargets()
    const selected = selectionTarget === appendable || multipleSelectionTargets.includes(appendable as any)

    const { handleMouseDown, handleClick, handleDoubleClick } = makeTreeItemCallbacks(appendable)

    return (
        <div onMouseDown={handleMouseDown} onClick={handleClick} onDblClick={handleDoubleClick} style={{
            color: "rgba(255, 255, 255, 0.75)",
            marginLeft: 8,
            borderLeft: "1px solid rgba(255, 255, 255, 0.05)"
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: selected ? "rgba(255, 255, 255, 0.1)" : undefined,
                cursor: "default"
            }}>
                {expanded ? (
                    <CollapseIcon style={expandIconStyle} onClick={() => setExpanded(false)} />
                ) : (
                    <ExpandIcon style={expandIconStyle} onClick={() => setExpanded(true)} />
                )}
                <CubeIcon />
                {name}
            </div>
            {expanded && appendableChildren?.map(childAppendable => (
                childAppendable instanceof Model ? (
                    <ModelTreeItem appendable={childAppendable} level={level + 1} />
                ) : (
                    <TreeItem key={childAppendable.uuid} appendable={childAppendable} level={level + 1} />
                )
            ))}
            {expanded && children}
        </div>
    )
}

export default TreeItem
import { h } from "preact"
import { useState } from "preact/hooks"
import { preventTreeShake, upperFirst } from "@lincode/utils"
import Appendable from "../../api/core/Appendable"
import CubeIcon from "./icons/CubeIcon"
import ExpandIcon from "./icons/ExpandIcon"
import CollapseIcon from "./icons/CollapseIcon"
import { useSelectionTarget } from "../states"
import { emitSceneGraphDoubleClick } from "../../events/onSceneGraphDoubleClick"
import SimpleObjectManager from "../../display/core/SimpleObjectManager"
import Model from "../../display/Model"
import ModelTreeItem from "./ModelTreeItem"

preventTreeShake(h)

export type TreeItemProps = {
    appendable: Appendable
    level: number
    children?: JSX.Element | Array<JSX.Element>
}

const TreeItem = ({ appendable, level, children }: TreeItemProps) => {
    //@ts-ignore
    const name = appendable.name || upperFirst(appendable.constructor.componentName)
    const appendableChildren = appendable.children ? [...appendable.children] : undefined
    const expandIconStyle = { opacity: (appendableChildren?.length || children) ? 0.5 : 0.05, cursor: "pointer" }

    const [expanded, setExpanded] = useState(!!appendableChildren?.length)
    const [selectionTarget, setSelectionTarget] = useSelectionTarget()

    const handleMouseDown = (e: MouseEvent) => {
        e.stopPropagation()
        setSelectionTarget(appendable)
    }
    const handleDoubleClick = (e: MouseEvent) => {
        e.stopPropagation()
        appendable instanceof SimpleObjectManager && emitSceneGraphDoubleClick(appendable)
    }

    return (
        <div onMouseDown={handleMouseDown} onDblClick={handleDoubleClick} style={{
            color: "rgba(255, 255, 255, 0.75)",
            marginLeft: 8,
            borderLeft: "1px solid rgba(255, 255, 255, 0.05)"
        }}>
            <div style={{
                display: "flex",
                backgroundColor: selectionTarget === appendable ? "rgba(255, 255, 255, 0.1)" : undefined,
                cursor: "default"
            }}>
                {expanded ? (
                    <CollapseIcon style={expandIconStyle} onClick={e => (e.stopPropagation(), setExpanded(false))} />
                ) : (
                    <ExpandIcon style={expandIconStyle} onClick={e => (e.stopPropagation(), setExpanded(true))} />
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
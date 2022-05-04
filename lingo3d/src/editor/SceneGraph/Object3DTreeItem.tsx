import { h } from "preact"
import { useState } from "preact/hooks"
import { preventTreeShake } from "@lincode/utils"
import CubeIcon from "./icons/CubeIcon"
import ExpandIcon from "./icons/ExpandIcon"
import CollapseIcon from "./icons/CollapseIcon"
import { useSelectionTarget } from "../states"
import { emitSceneGraphDoubleClick } from "../../events/onSceneGraphDoubleClick"
import SimpleObjectManager from "../../display/core/SimpleObjectManager"
import { Object3D } from "three"
import { TreeItemProps } from "./TreeItem"

preventTreeShake(h)

type Object3DTreeItemProps = TreeItemProps & {
    object3d: Object3D
}

const Object3DTreeItem = ({ appendable, object3d, level }: Object3DTreeItemProps) => {
    const expandIconStyle = { opacity: object3d.children.length ? 0.5 : 0.05 }

    const [expanded, setExpanded] = useState(false)
    const [, setSelectionTarget] = useSelectionTarget()

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
            fontFamily: "arial",
            fontSize: 12,
            marginLeft: 8,
            borderLeft: "1px solid rgba(255, 255, 255, 0.05)"
        }}>
            <div style={{
                display: "flex",
                // backgroundColor: selectionTarget === appendable ? "rgba(255, 255, 255, 0.1)" : undefined,
                cursor: "default"
            }}>
                {expanded ? (
                    <CollapseIcon style={expandIconStyle} onClick={e => (e.stopPropagation(), setExpanded(false))} />
                ) : (
                    <ExpandIcon style={expandIconStyle} onClick={e => (e.stopPropagation(), setExpanded(true))} />
                )}
                <CubeIcon />
                {object3d.name}
            </div>
            {expanded && object3d.children.map(child => (
                <Object3DTreeItem key={child.uuid} object3d={child} appendable={appendable} level={level + 1} />
            ))}
        </div>
    )
}

export default Object3DTreeItem
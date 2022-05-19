import { h } from "preact"
import { useState } from "preact/hooks"
import { preventTreeShake } from "@lincode/utils"
import CubeIcon from "./icons/CubeIcon"
import ExpandIcon from "./icons/ExpandIcon"
import CollapseIcon from "./icons/CollapseIcon"
import { Object3D } from "three"
import { makeTreeItemCallbacks, TreeItemProps } from "./TreeItem"

preventTreeShake(h)

type Object3DTreeItemProps = TreeItemProps & {
    object3d: Object3D
}

const Object3DTreeItem = ({ appendable, object3d, level }: Object3DTreeItemProps) => {
    const expandIconStyle = { opacity: object3d.children.length ? 0.5 : 0.05, cursor: "pointer" }

    const [expanded, setExpanded] = useState(false)

    const { setClickEl, handleClick, handleDoubleClick } = makeTreeItemCallbacks()

    return (
        <div
         ref={setClickEl}
         onClick={handleClick}
         onDblClick={handleDoubleClick}
         onDragStart={e => e.stopPropagation()}
         onDragEnd={e => e.stopPropagation()}
         onDragOver={e => (e.stopPropagation(), e.preventDefault())}
         onDragEnter={e => (e.stopPropagation(), e.preventDefault())}
         onDragLeave={e => e.stopPropagation()}
         onDrop={e => e.stopPropagation()}
         style={{
            color: "rgba(255, 255, 255, 0.75)",
            marginLeft: 8,
            borderLeft: "1px solid rgba(255, 255, 255, 0.05)"
         }}
        >
            <div style={{
                display: "flex",
                alignItems: "center",
                // backgroundColor: selectionTarget === appendable ? "rgba(255, 255, 255, 0.1)" : undefined,
                cursor: "default"
            }}>
                {expanded ? (
                    <CollapseIcon style={expandIconStyle} onClick={() => setExpanded(false)} />
                ) : (
                    <ExpandIcon style={expandIconStyle} onClick={() => setExpanded(true)} />
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
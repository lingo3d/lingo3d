import { h } from "preact"
import { useEffect, useState } from "preact/hooks"
import { preventTreeShake } from "@lincode/utils"
import ExpandIcon from "./icons/ExpandIcon"
import CollapseIcon from "./icons/CollapseIcon"
import { Object3D } from "three"
import { makeTreeItemCallbacks, TreeItemProps } from "./TreeItem"
import { useSceneGraphExpanded, useSceneGraphTarget } from "../states"
import ComponentIcon from "./icons/ComponentIcon"

preventTreeShake(h)

type Object3DTreeItemProps = TreeItemProps & {
    object3d: Object3D
}

const Object3DTreeItem = ({ appendable, object3d, level }: Object3DTreeItemProps) => {
    const expandIconStyle = { opacity: object3d.children.length ? 0.5 : 0.05, cursor: "pointer" }

    const [expanded, setExpanded] = useState(false)
    const [sceneGraphTarget] = useSceneGraphTarget()

    const { setClickEl, handleClick, handleDoubleClick } = makeTreeItemCallbacks(object3d, appendable)

    const [sceneGraphExpanded, setSceneGraphExpanded] = useSceneGraphExpanded()

    useEffect(() => {
        if (!sceneGraphExpanded) return

        if (sceneGraphExpanded.has(object3d))
            setExpanded(true)

    }, [sceneGraphExpanded])

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
                border: sceneGraphTarget === object3d ? "1px solid rgba(255, 255, 255, 0.5)" : undefined,
                cursor: "default"
            }}>
                {expanded ? (
                    <CollapseIcon style={expandIconStyle} onClick={() => (setExpanded(false), setSceneGraphExpanded(undefined))} />
                ) : (
                    <ExpandIcon style={expandIconStyle} onClick={() => setExpanded(true)} />
                )}
                <ComponentIcon />
                {object3d.name}
            </div>
            {expanded && object3d.children.map(child => (
                <Object3DTreeItem key={child.uuid} object3d={child} appendable={appendable} level={level + 1} />
            ))}
        </div>
    )
}

export default Object3DTreeItem
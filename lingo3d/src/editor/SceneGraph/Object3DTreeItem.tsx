import { h } from "preact"
import { useEffect, useMemo, useRef, useState } from "preact/hooks"
import { preventTreeShake } from "@lincode/utils"
import ExpandIcon from "./icons/ExpandIcon"
import CollapseIcon from "./icons/CollapseIcon"
import { Object3D } from "three"
import { makeTreeItemCallbacks, TreeItemProps } from "./TreeItem"
import { useSceneGraphExpanded, useSceneGraphTarget } from "../states"
import ComponentIcon from "./icons/ComponentIcon"
import { setSceneGraphPreventDrag } from "../../states/useSceneGraphPreventDrag"

preventTreeShake(h)

document.addEventListener("mouseup", () => setSceneGraphPreventDrag(false))

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

    const startRef = useRef<HTMLDivElement>(null)
    const endRef = useRef<HTMLDivElement>(null)

    const selected = sceneGraphTarget === object3d

    const highlightWidth = useMemo(() => {
        if (!selected || !startRef.current || !endRef.current) return

        const boundsStart = startRef.current.getBoundingClientRect()
        const boundsEnd = endRef.current.getBoundingClientRect()
        return boundsEnd.right - boundsStart.left + 4

    }, [selected, expanded])

    return (
        <div
         ref={setClickEl}
         onClick={handleClick}
         onDblClick={handleDoubleClick}
         onMouseDown={() => setSceneGraphPreventDrag(true)}
         style={{
            color: "rgba(255, 255, 255, 0.75)",
            marginLeft: 8,
            borderLeft: "1px solid rgba(255, 255, 255, 0.05)"
         }}
        >
            <div ref={startRef} style={{
                display: "flex",
                alignItems: "center",
                border: selected ? "1px solid rgba(255, 255, 255, 0.5)" : undefined,
                width: highlightWidth,
                minWidth: "100%",
                cursor: "default"
            }}>
                {expanded ? (
                    <CollapseIcon style={expandIconStyle} onClick={() => (setExpanded(false), setSceneGraphExpanded(undefined))} />
                ) : (
                    <ExpandIcon style={expandIconStyle} onClick={() => setExpanded(true)} />
                )}
                <ComponentIcon />
                <div ref={endRef}>{object3d.name}</div>
            </div>
            {expanded && object3d.children.map(child => (
                <Object3DTreeItem key={child.uuid} object3d={child} appendable={appendable} level={level + 1} />
            ))}
        </div>
    )
}

export default Object3DTreeItem
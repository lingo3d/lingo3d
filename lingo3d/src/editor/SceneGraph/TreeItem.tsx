import { h } from "preact"
import { useState, useEffect, useRef, useMemo } from "preact/hooks"
import { preventTreeShake } from "@lincode/utils"
import Appendable, { hiddenAppendables } from "../../api/core/Appendable"
import CubeIcon from "./icons/CubeIcon"
import ExpandIcon from "./icons/ExpandIcon"
import CollapseIcon from "./icons/CollapseIcon"
import { useMultipleSelectionTargets, useSceneGraphExpanded, useSceneGraphPreventDrag, useSelectionTarget } from "../states"
import { emitEditorCenterView } from "../../events/onEditorCenterView"
import Model from "../../display/Model"
import ModelTreeItem from "./ModelTreeItem"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import useClick from "./useClick"
import { isPositionedItem } from "../../api/core/PositionedItem"
import { Object3D } from "three"
import { setSceneGraphTarget } from "../../states/useSceneGraphTarget"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import mainOrbitCamera from "../../engine/mainOrbitCamera"
import getComponentName from "../getComponentName"

preventTreeShake(h)

export type TreeItemProps = {
    appendable: Appendable
    level: number
    children?: JSX.Element | Array<JSX.Element>
}

export const makeTreeItemCallbacks = (target: Appendable | Object3D, parent?: Appendable) => {
    const setClickEl = useClick(e => {
        e.stopPropagation()
        mainOrbitCamera.activate()
        isPositionedItem(parent) && getSelectionTarget() !== parent && emitSelectionTarget(parent)
        if (target instanceof Object3D)
            queueMicrotask(() => setSceneGraphTarget(target))
        else
            emitSelectionTarget(target)
    })

    const handleClick = (e: MouseEvent) => e.stopPropagation()

    const handleDoubleClick = (e: MouseEvent) => {
        e.stopPropagation()
        if (!isPositionedItem(target)) return
        emitEditorCenterView(target)
        emitSelectionTarget(target)
    }
    
    return { setClickEl, handleClick, handleDoubleClick }
}

export const draggingItemPtr: [Appendable | undefined] = [undefined]

const TreeItem = ({ appendable, level, children }: TreeItemProps) => {
    const name = getComponentName(appendable)
    
    const appendableChildren = useMemo(() => {
        return appendable.children ? [...appendable.children].filter(item => !hiddenAppendables.has(item)) : undefined
    }, [appendable.children?.size])

    const expandIconStyle = { opacity: (appendableChildren?.length || children) ? 0.5 : 0.05, cursor: "pointer" }

    const [dragOver, setDragOver] = useState(false)
    const [expanded, setExpanded] = useState(false)
    // const [expanded, setExpanded] = useState(!!appendableChildren?.length)
    
    const [selectionTarget] = useSelectionTarget()
    const [multipleSelectionTargets] = useMultipleSelectionTargets()
    const selected = selectionTarget === appendable || multipleSelectionTargets.includes(appendable as any)

    const { setClickEl, handleClick, handleDoubleClick } = makeTreeItemCallbacks(appendable)

    const [sceneGraphExpanded, setSceneGraphExpanded] = useSceneGraphExpanded()

    useEffect(() => {
        if (!sceneGraphExpanded) return

        if (sceneGraphExpanded.has(appendable.outerObject3d))
            setExpanded(true)

    }, [sceneGraphExpanded])

    const startRef = useRef<HTMLDivElement>(null)
    const endRef = useRef<HTMLDivElement>(null)

    const highlightWidth = useMemo(() => {
        if (!selected || !startRef.current || !endRef.current) return

        const boundsStart = startRef.current.getBoundingClientRect()
        const boundsEnd = endRef.current.getBoundingClientRect()
        return boundsEnd.right - boundsStart.left + 4

    }, [selected, expanded])

    const [preventDrag] = useSceneGraphPreventDrag()

    return (
        <div
         ref={setClickEl}
         onClick={handleClick}
         onDblClick={handleDoubleClick}
         draggable={!preventDrag}
         onDragStart={e => (e.stopPropagation(), draggingItemPtr[0] = appendable)}
         onDragEnd={e => (e.stopPropagation(), draggingItemPtr[0] = undefined)}
         onDragOver={e => {
             e.stopPropagation()
             e.preventDefault()
             if (!draggingItemPtr[0] || draggingItemPtr[0] === appendable) return
             setDragOver(true)
         }}
         onDragEnter={e => {
             e.stopPropagation()
             e.preventDefault()
             if (!draggingItemPtr[0] || draggingItemPtr[0] === appendable) return
             setDragOver(true)
         }}
         onDragLeave={e => {
             e.stopPropagation()
             if (!draggingItemPtr[0] || draggingItemPtr[0] === appendable) return
             setDragOver(false)
         }}
         onDrop={e => {
             e.stopPropagation()
             if (!draggingItemPtr[0] || draggingItemPtr[0] === appendable) return
             setDragOver(false)
             appendable.attach(draggingItemPtr[0])
         }}
         style={{
            color: "rgba(255, 255, 255, 0.75)",
            marginLeft: 8,
            borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
            background: dragOver ? "rgba(255, 255, 255, 0.5)" : "none"
         }}
        >
            <div ref={startRef} style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: selected ? "rgba(255, 255, 255, 0.1)" : undefined,
                width: highlightWidth,
                minWidth: "100%",
                cursor: "default"
            }}>
                {expanded ? (
                    <CollapseIcon style={expandIconStyle} onClick={() => (setExpanded(false), setSceneGraphExpanded(undefined))} />
                ) : (
                    <ExpandIcon style={expandIconStyle} onClick={() => setExpanded(true)} />
                )}
                <CubeIcon />
                <div ref={endRef}>{name}</div>
            </div>
            {expanded && appendableChildren?.map(childAppendable => (
                childAppendable instanceof Model ? (
                    <ModelTreeItem key={childAppendable.uuid} appendable={childAppendable} level={level + 1} />
                ) : (
                    <TreeItem key={childAppendable.uuid} appendable={childAppendable} level={level + 1} />
                )
            ))}
            {expanded && children}
        </div>
    )
}

export default TreeItem
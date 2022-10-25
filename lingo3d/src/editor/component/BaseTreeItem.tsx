import { ComponentChildren } from "preact"
import { useState, useRef, useMemo, useContext, useEffect } from "preact/hooks"
import CollapseIcon from "./icons/CollapseIcon"
import ExpandIcon from "./icons/ExpandIcon"
import { TreeItemContext } from "./TreeItemContextProviter"
import useClick from "../hooks/useClick"
import Appendable from "../../api/core/Appendable"
import mergeRefs from "../hooks/mergeRefs"
import { setDragImage } from "../utils/drag"

export type BaseTreeItemProps = {
    label?: string
    selected?: boolean
    children?: ComponentChildren
    onCollapse?: () => void
    onExpand?: () => void
    onClick?: () => void
    onDrop?: (draggingItem?: any) => void
    myDraggingItem?: any
    draggable?: boolean
    expanded?: boolean
    expandable?: boolean
    outlined?: boolean
    IconComponent?: any
}

const BaseTreeItem = ({
    label,
    children,
    selected,
    onCollapse,
    onExpand,
    onClick,
    onDrop,
    myDraggingItem,
    draggable,
    expanded: expandedProp,
    expandable,
    outlined,
    IconComponent
}: BaseTreeItemProps) => {
    const expandIconStyle = {
        opacity: expandable ? 0.5 : 0.05,
        cursor: "pointer"
    }

    const [expanded, setExpanded] = useState(!!expandedProp)
    useEffect(() => {
        setExpanded(!!expandedProp)
    }, [expandedProp])

    const startRef = useRef<HTMLDivElement>(null)
    const endRef = useRef<HTMLDivElement>(null)

    const highlightWidth = useMemo(() => {
        if (!selected || !startRef.current || !endRef.current) return

        const boundsStart = startRef.current.getBoundingClientRect()
        const boundsEnd = endRef.current.getBoundingClientRect()
        return boundsEnd.right - boundsStart.left + 4
    }, [selected, expanded])

    const collapse = () => {
        setExpanded(false)
        onCollapse?.()
    }
    const expand = () => {
        setExpanded(true)
        onExpand?.()
    }

    const handleDoubleClick = (e: MouseEvent) => {
        e.stopPropagation()
        expanded ? collapse() : expand()
    }

    const context = useContext(TreeItemContext)
    const canSetDragOver = () =>
        draggable &&
        context.draggingItem &&
        context.draggingItem !== myDraggingItem

    const [dragOver, setDragOver] = useState(false)
    const clickRef = useClick(onClick)

    return (
        <div
            draggable={draggable}
            onDragStart={(e) => {
                e.stopPropagation()
                context.draggingItem = myDraggingItem
                setDragImage(e)
            }}
            onDragEnd={(e) => {
                e.stopPropagation()
                context.draggingItem = undefined
            }}
            onDragOver={(e) => {
                e.stopPropagation()
                e.preventDefault()
                canSetDragOver() && setDragOver(true)
            }}
            onDragEnter={(e) => {
                e.stopPropagation()
                e.preventDefault()
                canSetDragOver() && setDragOver(true)
            }}
            onDragLeave={(e) => {
                e.stopPropagation()
                canSetDragOver() && setDragOver(false)
            }}
            onDrop={(e) => {
                e.stopPropagation()

                if (!canSetDragOver()) return
                setDragOver(false)

                if (
                    !context.draggingItem.traverseSome(
                        (child: Appendable) => myDraggingItem === child
                    )
                )
                    onDrop?.(context.draggingItem)
            }}
            style={{
                color: "rgba(255, 255, 255, 0.75)",
                marginLeft: 8,
                borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
                background: dragOver ? "rgba(255, 255, 255, 0.5)" : "none"
            }}
        >
            <div
                ref={mergeRefs(startRef, clickRef)}
                onDblClick={handleDoubleClick}
                style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor:
                        selected && !outlined
                            ? "rgba(255, 255, 255, 0.1)"
                            : undefined,
                    outline:
                        selected && outlined
                            ? "1px solid rgba(255, 255, 255, 0.5)"
                            : undefined,
                    width: highlightWidth,
                    minWidth: "100%",
                    cursor: "default"
                }}
            >
                {expanded ? (
                    <CollapseIcon style={expandIconStyle} onClick={collapse} />
                ) : (
                    <ExpandIcon style={expandIconStyle} onClick={expand} />
                )}
                {IconComponent && <IconComponent />}
                <div ref={endRef}>{label}</div>
            </div>
            {expanded &&
                (typeof children === "function" ? children() : children)}
        </div>
    )
}

export default BaseTreeItem

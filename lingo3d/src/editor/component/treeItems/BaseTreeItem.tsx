import { ComponentChildren } from "preact"
import { useState, useRef, useMemo, useEffect } from "preact/hooks"
import CollapseIcon from "../icons/CollapseIcon"
import ExpandIcon from "../icons/ExpandIcon"
import Appendable from "../../../api/core/Appendable"
import { setDragImage } from "../../utils/drag"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { Object3D } from "three"
import { draggingItemPtr } from "../../../pointers/draggingItemPtr"
import useMouseDown from "../../hooks/useMouseDown"

export type Props = {
    label?: string
    selected?: boolean
    children?: ComponentChildren
    onCollapse?: () => void
    onExpand?: () => void
    onClick?: (e: MouseEvent) => void
    onMouseDown?: (e: MouseEvent) => void
    onContextMenu?: (e: MouseEvent) => void
    onDrop?: (draggingItem: Appendable | MeshAppendable) => void
    onDragStart?: () => void
    onDragEnd?: () => void
    myDraggingItem?: Appendable | MeshAppendable | Object3D
    draggable?: boolean
    expanded?: boolean
    expandable?: boolean
    outlined?: boolean
    IconComponent?: any
    height?: number
}

const BaseTreeItem = ({
    label,
    children,
    selected,
    onCollapse,
    onExpand,
    onClick,
    onMouseDown,
    onContextMenu,
    onDrop,
    onDragStart,
    onDragEnd,
    myDraggingItem,
    draggable,
    expanded: expandedProp,
    expandable = !!children,
    outlined,
    IconComponent,
    height
}: Props) => {
    const expandIconStyle = {
        opacity: expandable ? 0.5 : 0.05,
        cursor: "pointer"
    }

    const [expanded, setExpanded] = useState(!!expandedProp)
    useEffect(() => {
        setExpanded(!!expandedProp)
    }, [expandedProp])

    const startRef = useMouseDown(onClick)
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

    const canSetDragOver = () =>
        draggable && draggingItemPtr[0] && draggingItemPtr[0] !== myDraggingItem

    const [dragOver, setDragOver] = useState(false)

    return (
        <div
            draggable={draggable}
            onDragStart={(e) => {
                e.stopPropagation()
                draggingItemPtr[0] = myDraggingItem
                setDragImage(e)
                onDragStart?.()
            }}
            onDragEnd={(e) => {
                e.stopPropagation()
                draggingItemPtr[0] = undefined
                onDragEnd?.()
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
                    draggingItemPtr[0] instanceof Appendable &&
                    !draggingItemPtr[0].traverseSome(
                        (child: Appendable) => myDraggingItem === child
                    )
                )
                    onDrop?.(draggingItemPtr[0])
            }}
            style={{
                color: "rgba(255, 255, 255, 0.75)",
                marginLeft: 8,
                borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
                background: dragOver ? "rgba(255, 255, 255, 0.5)" : "none"
            }}
        >
            <div
                ref={startRef}
                onMouseDown={onMouseDown}
                onDblClick={expanded ? collapse : expand}
                onContextMenu={onContextMenu}
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
                    height
                }}
            >
                {expanded ? (
                    <CollapseIcon style={expandIconStyle} onClick={collapse} />
                ) : (
                    <ExpandIcon style={expandIconStyle} onClick={expand} />
                )}
                {IconComponent && <IconComponent />}
                <div ref={endRef} style={{ whiteSpace: "nowrap" }}>
                    {label}
                </div>
            </div>
            {expanded &&
                (typeof children === "function" ? children() : children)}
        </div>
    )
}

export default BaseTreeItem

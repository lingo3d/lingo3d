import { ComponentChildren } from "preact"
import { useState, useRef, useMemo } from "preact/hooks"
import CollapseIcon from "../icons/CollapseIcon"
import ExpandIcon from "../icons/ExpandIcon"
import Appendable from "../../../display/core/Appendable"
import { setDragImage } from "../../utils/dragToCreate"
import MeshAppendable from "../../../display/core/MeshAppendable"
import { draggingItemPtr } from "../../../pointers/draggingItemPtr"
import useMouseDown from "../../hooks/useMouseDown"
import { TREE_ITEM_HEIGHT } from "../../../globals"
import { Signal } from "@preact/signals"
import FoundManager from "../../../display/core/FoundManager"

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
    myDraggingItem?: Appendable | MeshAppendable | FoundManager
    draggable?: boolean
    expandedSignal?: Signal<boolean>
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
    expandedSignal,
    expandable = !!children,
    outlined,
    IconComponent,
    height = TREE_ITEM_HEIGHT
}: Props) => {
    const expandIconStyle = {
        opacity: expandable ? 0.5 : 0.05,
        cursor: "pointer"
    }
    const startRef = useMouseDown(onClick)
    const endRef = useRef<HTMLDivElement>(null)

    const highlightWidth = useMemo(() => {
        if (!selected || !startRef.current || !endRef.current) return
        const boundsStart = startRef.current.getBoundingClientRect()
        const boundsEnd = endRef.current.getBoundingClientRect()
        return boundsEnd.right - boundsStart.left + 4
    }, [selected, expandedSignal?.value])

    const collapse = () => {
        if (expandedSignal) expandedSignal.value = false
        onCollapse?.()
    }
    const expand = () => {
        if (expandedSignal) expandedSignal.value = true
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
                backgroundColor: dragOver
                    ? "rgba(255, 255, 255, 0.5)"
                    : undefined
            }}
        >
            <div
                ref={startRef}
                onMouseDown={onMouseDown}
                onDblClick={expandedSignal?.value ? collapse : expand}
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
                {expandedSignal?.value ? (
                    <CollapseIcon style={expandIconStyle} onClick={collapse} />
                ) : (
                    <ExpandIcon style={expandIconStyle} onClick={expand} />
                )}
                {IconComponent && <IconComponent />}
                <div ref={endRef} style={{ whiteSpace: "nowrap" }}>
                    {label}
                </div>
            </div>
            {expandedSignal?.value &&
                (typeof children === "function" ? children() : children)}
        </div>
    )
}

export default BaseTreeItem

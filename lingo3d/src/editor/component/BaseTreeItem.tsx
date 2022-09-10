import { h } from "preact"
import { useState, useRef, useMemo } from "preact/hooks"
import { preventTreeShake } from "@lincode/utils"
import CollapseIcon from "../SceneGraph/icons/CollapseIcon"
import ExpandIcon from "../SceneGraph/icons/ExpandIcon"
import CubeIcon from "../SceneGraph/icons/CubeIcon"

preventTreeShake(h)

export type BaseTreeItemProps = {
    label: string
    children?: JSX.Element | Array<JSX.Element>
    selected?: boolean
    onCollapse?: () => void
    onExpand?: () => void
    onDragStart?: (e: DragEvent) => void
    onDragEnd?: (e: DragEvent) => void
    onDragOver?: (e: DragEvent) => void
    onDragEnter?: (e: DragEvent) => void
    onDragLeave?: (e: DragEvent) => void
    onDrop?: (e: DragEvent) => void
    dragOver?: boolean
    preventDrag?: boolean
}

const BaseTreeItem = ({
    label,
    children,
    selected,
    onCollapse,
    onExpand,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onDrop,
    dragOver,
    preventDrag
}: BaseTreeItemProps) => {
    const expandIconStyle = {
        opacity: children ? 0.5 : 0.05,
        cursor: "pointer"
    }

    const [expanded, setExpanded] = useState(false)
    // const [expanded, setExpanded] = useState(!!appendableChildren?.length)

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

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            onDblClick={handleDoubleClick}
            draggable={!preventDrag}
            onDragStart={(e) => {
                e.stopPropagation()
                onDragStart?.(e)
            }}
            onDragEnd={(e) => {
                e.stopPropagation()
                onDragEnd?.(e)
            }}
            onDragOver={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onDragOver?.(e)
            }}
            onDragEnter={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onDragEnter?.(e)
            }}
            onDragLeave={(e) => {
                e.stopPropagation()
                onDragLeave?.(e)
            }}
            onDrop={(e) => {
                e.stopPropagation()
                onDrop?.(e)
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
                style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: selected
                        ? "rgba(255, 255, 255, 0.1)"
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
                <CubeIcon />
                <div ref={endRef}>{label}</div>
            </div>
            {expanded && children}
        </div>
    )
}

export default BaseTreeItem

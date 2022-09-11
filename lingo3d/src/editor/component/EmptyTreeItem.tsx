import { useContext, useState } from "preact/hooks"
import { TreeItemContext } from "./TreeItemContextProviter"

type EmptyTreeItemProps = {
    onDrop?: (draggingItem?: any) => void
}

const EmptyTreeItem = ({ onDrop }: EmptyTreeItemProps) => {
    const [dragOver, setDragOver] = useState(false)
    const context = useContext(TreeItemContext)

    return (
        <div
            onDragOver={(e) => {
                e.stopPropagation()
                e.preventDefault()
                context.draggingItem && setDragOver(true)
            }}
            onDragEnter={(e) => {
                e.stopPropagation()
                e.preventDefault()
                context.draggingItem && setDragOver(true)
            }}
            onDragLeave={(e) => {
                e.stopPropagation()
                setDragOver(false)
            }}
            onDrop={(e) => {
                e.stopPropagation()
                setDragOver(false)
                context.draggingItem && onDrop?.(context.draggingItem)
            }}
            style={{
                background: dragOver ? "rgba(255, 255, 255, 0.5)" : "none",
                width: "100%",
                height: 18
            }}
        />
    )
}

export default EmptyTreeItem

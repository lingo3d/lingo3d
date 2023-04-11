import { useState } from "preact/hooks"
import Appendable from "../../../api/core/Appendable"
import { draggingItemPtr } from "../../../pointers/draggingItemPtr"

type Props = {
    onDrop?: (draggingItem: Appendable) => void
}

const EmptyTreeItem = ({ onDrop }: Props) => {
    const [dragOver, setDragOver] = useState(false)

    return (
        <div
            onDragOver={(e) => {
                e.stopPropagation()
                e.preventDefault()
                draggingItemPtr[0] && setDragOver(true)
            }}
            onDragEnter={(e) => {
                e.stopPropagation()
                e.preventDefault()
                draggingItemPtr[0] && setDragOver(true)
            }}
            onDragLeave={(e) => {
                e.stopPropagation()
                setDragOver(false)
            }}
            onDrop={(e) => {
                e.stopPropagation()
                setDragOver(false)
                draggingItemPtr[0] instanceof Appendable &&
                    onDrop?.(draggingItemPtr[0])
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

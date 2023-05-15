import { useState } from "preact/hooks"
import Appendable from "../../../display/core/Appendable"
import { draggingItemPtr } from "../../../pointers/draggingItemPtr"
import { TREE_ITEM_HEIGHT } from "../../../globals"

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
                backgroundColor: dragOver
                    ? "rgba(255, 255, 255, 0.5)"
                    : undefined,
                width: "100%",
                height: TREE_ITEM_HEIGHT
            }}
        />
    )
}

export default EmptyTreeItem

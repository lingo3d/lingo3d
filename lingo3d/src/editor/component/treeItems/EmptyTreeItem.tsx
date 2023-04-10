import { useState } from "preact/hooks"
import treeContext from "./treeContext"
import Appendable from "../../../api/core/Appendable"

type Props = {
    onDrop?: (draggingItem?: Appendable) => void
}

const EmptyTreeItem = ({ onDrop }: Props) => {
    const [dragOver, setDragOver] = useState(false)

    return (
        <div
            onDragOver={(e) => {
                e.stopPropagation()
                e.preventDefault()
                treeContext.draggingItem && setDragOver(true)
            }}
            onDragEnter={(e) => {
                e.stopPropagation()
                e.preventDefault()
                treeContext.draggingItem && setDragOver(true)
            }}
            onDragLeave={(e) => {
                e.stopPropagation()
                setDragOver(false)
            }}
            onDrop={(e) => {
                e.stopPropagation()
                setDragOver(false)
                treeContext.draggingItem instanceof Appendable &&
                    onDrop?.(treeContext.draggingItem)
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

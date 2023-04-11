import { useState } from "preact/hooks"
import treeContext from "../component/treeItems/treeContext"

type JointProps = {
    x: number
    y: number
    onMouseMove?: (e: MouseEvent) => void
    onMouseLeave?: (e: MouseEvent) => void
}

const Joint = ({ x, y, onMouseMove, onMouseLeave }: JointProps) => {
    const [dragOver, setDragOver] = useState(false)

    return (
        <div
            style={{
                position: "absolute",
                width: 14,
                height: 14,
                left: 50 + x + "%",
                top: y + "%",
                transform: "translateX(-50%)",
                borderRadius: 20,
                border: "1px solid rgba(255, 255, 255, 0.5)",
                background: "rgba(255, 255, 255, 0.2)"
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
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
                console.log(treeContext.draggingItem)
            }}
        />
    )
}

export default Joint

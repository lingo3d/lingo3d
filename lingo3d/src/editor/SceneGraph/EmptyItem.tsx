import { h } from "preact"
import { useContext, useState } from "preact/hooks"
import { preventTreeShake } from "@lincode/utils"
import { emitSceneGraphChange } from "../../events/onSceneGraphChange"
import { appendableRoot } from "../../api/core/Appendable"
import scene from "../../engine/scene"
import { TreeItemContext } from "../component/BaseTreeItem"

preventTreeShake(h)

const EmptyItem = () => {
    const [dragOver, setDragOver] = useState(false)
    const context = useContext(TreeItemContext)

    return (
        <div
            onDragOver={(e) => {
                e.stopPropagation()
                e.preventDefault()
                if (!context.draggingItem) return
                setDragOver(true)
            }}
            onDragEnter={(e) => {
                e.stopPropagation()
                e.preventDefault()
                if (!context.draggingItem) return
                setDragOver(true)
            }}
            onDragLeave={(e) => {
                e.stopPropagation()
                if (!context.draggingItem) return
                setDragOver(false)
            }}
            onDrop={(e) => {
                e.stopPropagation()
                setDragOver(false)

                const child = context.draggingItem
                if (!child) return

                emitSceneGraphChange()
                appendableRoot.add(child)
                scene.attach(child.outerObject3d)
                child.parent?.children?.delete(child)
                child.parent = undefined
            }}
            style={{
                background: dragOver ? "rgba(255, 255, 255, 0.5)" : "none",
                width: "100%",
                height: 18
            }}
        />
    )
}

export default EmptyItem

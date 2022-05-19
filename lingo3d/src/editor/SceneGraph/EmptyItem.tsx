import { h } from "preact"
import { useState } from "preact/hooks"
import { preventTreeShake } from "@lincode/utils"
import { draggingItemPtr } from "./TreeItem"
import { emitSceneChange } from "../../events/onSceneChange"
import { appendableRoot } from "../../api/core/Appendable"
import scene from "../../engine/scene"

preventTreeShake(h)

const EmptyItem = () => {
    const [dragOver, setDragOver] = useState(false)

    return (
        <div
         onDragOver={e => {
             e.stopPropagation()
             e.preventDefault()
             if (!draggingItemPtr[0]) return
             setDragOver(true)
         }}
         onDragEnter={e => {
             e.stopPropagation()
             e.preventDefault()
             if (!draggingItemPtr[0]) return
             setDragOver(true)
         }}
         onDragLeave={e => {
             e.stopPropagation()
             if (!draggingItemPtr[0]) return
             setDragOver(false)
         }}
         onDrop={e => {
             e.stopPropagation()
             setDragOver(false)

             const child = draggingItemPtr[0]
             if (!child) return
             
             emitSceneChange()
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
import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"
import { useState } from "preact/hooks"
import Model from "../../display/Model"
import clientToWorld from "../../display/utils/clientToWorld"
import { point2Vec } from "../../display/utils/vec2Point"
import { container } from "../../engine/renderLoop/renderSetup"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import FileIcon from "./icons/FileIcon"

preventTreeShake(h)

let draggingItem: File | undefined

document.addEventListener("drop", (e) => e.preventDefault())
container.addEventListener("drop", (e) => {
    if (!draggingItem) return
    const manager = new Model()
    manager.outerObject3d.position.copy(
        point2Vec(clientToWorld(e.clientX, e.clientY))
    )
    emitSelectionTarget(manager)
    console.log(draggingItem)
})

type FileButtonProps = {
    file: File
}

const FileButton = ({ file }: FileButtonProps) => {
    const [hover, setHover] = useState(false)

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: "5px 6px 5px 6px",
                cursor: "pointer",
                width: "70px",
                height: "80px",
                background: hover
                    ? "rgba(255,255,255,0.2)"
                    : "rgb(40, 41, 46)"
            }}
            onMouseEnter={() => {
                setHover(true)
            }}
            onMouseLeave={() => setHover(false)}
            draggable
            onDragStart={() => (draggingItem = file)}
            onDragEnd={() => (draggingItem = undefined)}
        >
            <FileIcon />
            <div
                style={{
                    margin: 0,
                    width: "100%",
                    height: "20px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "center"
                }}
            >
                {file.name}
            </div>
        </div>
    )
}

export default FileButton

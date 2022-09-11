import { forceGet, preventTreeShake, splitFileName } from "@lincode/utils"
import { h } from "preact"
import objectURLExtensionMap from "../../display/core/utils/objectURLExtensionMap"
import Model from "../../display/Model"
import clientToWorld from "../../display/utils/clientToWorld"
import { point2Vec } from "../../display/utils/vec2Point"
import { container } from "../../engine/renderLoop/renderSetup"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import FileIcon from "./icons/FileIcon"

preventTreeShake(h)

const objectURLMap = new WeakMap<File, string>()

let draggingItem: File | undefined

document.addEventListener("drop", (e) => e.preventDefault())
container.addEventListener("drop", (e) => {
    if (!draggingItem) return

    const extension = splitFileName(draggingItem.name)[1]?.toLowerCase()
    if (extension !== "glb" && extension !== "fbx") return

    const manager = new Model()
    manager.src = forceGet(objectURLMap, draggingItem, () => {
        const url = URL.createObjectURL(draggingItem!)
        objectURLExtensionMap.set(url, extension)
        return url
    })
    manager.outerObject3d.position.copy(
        point2Vec(clientToWorld(e.clientX, e.clientY))
    )
    emitSelectionTarget(manager)
})

type FileButtonProps = {
    file: File
}

const FileButton = ({ file }: FileButtonProps) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: "5px 6px 5px 6px",
                width: "70px",
                height: "80px"
            }}
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

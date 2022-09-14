import { forceGet, splitFileName } from "@lincode/utils"
import {
    fileObjectURLMap,
    objectURLFileMap,
    objectURLExtensionMap
} from "../../display/core/utils/objectURLMaps"
import Model from "../../display/Model"
import clientToWorld from "../../display/utils/clientToWorld"
import { point2Vec } from "../../display/utils/vec2Point"
import { container } from "../../engine/renderLoop/renderSetup"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { useFileSelected } from "../states"
import FileIcon from "./icons/FileIcon"

let draggingItem: File | undefined

document.addEventListener("drop", (e) => e.preventDefault())
container.addEventListener("drop", (e) => {
    if (!draggingItem) return

    const extension = splitFileName(draggingItem.name)[1]?.toLowerCase()
    if (extension !== "glb" && extension !== "fbx") return

    const manager = new Model()
    manager.src = forceGet(fileObjectURLMap, draggingItem, () => {
        const url = URL.createObjectURL(draggingItem!)
        objectURLExtensionMap.set(url, extension)
        objectURLFileMap.set(url, draggingItem!)
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
    const [fileSelected, setFileSelected] = useFileSelected()

    return (
        <div
            style={{
                width: 70,
                height: 90,
                background:
                    fileSelected === file
                        ? "rgba(255, 255, 255, 0.1)"
                        : undefined
            }}
            draggable
            onDragStart={() => (draggingItem = file)}
            onDragEnd={() => (draggingItem = undefined)}
            onMouseDown={(e) => (e.stopPropagation(), setFileSelected(file))}
        >
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    paddingTop: 10,
                    paddingBottom: 4
                }}
            >
                <FileIcon />
            </div>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    paddingLeft: 10,
                    paddingRight: 10
                }}
            >
                <div
                    style={{
                        wordBreak: "break-word",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        lineClamp: 2,
                        webkitLineClamp: 2,
                        webkitBoxOrient: "vertical"
                    }}
                >
                    {file.name}
                </div>
            </div>
        </div>
    )
}

export default FileButton

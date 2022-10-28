import { getExtensionType } from "@lincode/filetypes"
import { splitFileName } from "@lincode/utils"
import loadFile from "../../api/files/loadFile"
import { createObjectURL } from "../../display/core/utils/objectURL"
import Model from "../../display/Model"
import { useFileSelected } from "../states"
import drag, { setDragImage } from "../utils/drag"
import FileIcon from "./icons/FileIcon"

const setDraggingItem = drag<File>((draggingItem, hitManager) => {
    const filetype = getExtensionType(draggingItem.name)
    const [filename, extension] = splitFileName(draggingItem.name)

    const lazyObjectURL = () =>
        createObjectURL(draggingItem, extension?.toLowerCase())

    if (filetype === "model") {
        const manager = new Model()
        manager.src = lazyObjectURL()
        return manager
    } else if (filetype === "image" && hitManager && "texture" in hitManager) {
        const name = filename.toLowerCase()
        if ("roughness" in hitManager) {
            if (name.includes("rough"))
                hitManager.roughnessMap = lazyObjectURL()
            else if (name.includes("metal"))
                hitManager.metalnessMap = lazyObjectURL()
            else if (name.includes("normal"))
                hitManager.normalMap = lazyObjectURL()
            else if (name.includes("disp"))
                hitManager.displacementMap = lazyObjectURL()
            else hitManager.texture = lazyObjectURL()
        } else hitManager.texture = lazyObjectURL()
    }
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
            onDragStart={(e) => {
                setDraggingItem(file)
                setDragImage(e)
            }}
            onDragEnd={() => setDraggingItem(undefined)}
            onMouseDown={(e) => (e.stopPropagation(), setFileSelected(file))}
            onDblClick={() => loadFile(file)}
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

import { splitFileName } from "@lincode/utils"
import { createObjectURL } from "../../display/core/utils/objectURL"
import Model from "../../display/Model"
import { useFileSelected } from "../states"
import drag, { dragImage } from "../utils/drag"
import FileIcon from "./icons/FileIcon"

const setDraggingItem = drag<File>((draggingItem) => {
    const extension = splitFileName(draggingItem.name)[1]?.toLowerCase()
    const manager = new Model()
    manager.src = createObjectURL(draggingItem, extension)
    return manager
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
                e.dataTransfer!.setDragImage(dragImage, 0, 0)
            }}
            onDragEnd={() => setDraggingItem(undefined)}
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

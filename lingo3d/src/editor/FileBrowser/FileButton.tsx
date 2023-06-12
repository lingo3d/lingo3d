import { getExtensionType } from "@lincode/filetypes"
import { splitFileName } from "@lincode/utils"
import loadFile from "../../api/files/loadFile"
import Model from "../../display/Model"
import useSyncState from "../hooks/useSyncState"
import { getFileSelected, setFileSelected } from "../../states/useFileSelected"
import dragToCreate, { setDragImage } from "../utils/dragToCreate"
import FileIcon from "./icons/FileIcon"
import { stopPropagation } from "../utils/stopPropagation"
import { getFileCurrent } from "../../states/useFileCurrent"
import relativePath from "../../api/path/relativePath"

const setDraggingItem = dragToCreate<File>((draggingItem, hitManager) => {
    const filetype = getExtensionType(draggingItem.name)
    const url = relativePath(
        getFileCurrent()?.webkitRelativePath ?? "",
        draggingItem.webkitRelativePath
    )
    if (filetype === "model") {
        const manager = new Model()
        manager.src = url
        return manager
    } else if (filetype === "image" && hitManager && "texture" in hitManager) {

        

        // const [filename] = splitFileName(draggingItem.name)
        // const name = filename.toLowerCase()
        // if (name.includes("rough")) hitManager.roughnessMap = url
        // else if (name.includes("metal")) hitManager.metalnessMap = url
        // else if (name.includes("normal")) hitManager.normalMap = url
        // else if (name.includes("disp")) hitManager.displacementMap = url
        // else hitManager.texture = url
    }
})

type Props = { file: File }

const FileButton = ({ file }: Props) => {
    const fileSelected = useSyncState(getFileSelected)

    return (
        <div
            ref={stopPropagation}
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
            onMouseDown={() => setFileSelected(file)}
            onDblClick={() => loadFile(file)}
        >
            <div
                className="lingo3d-flexcenter"
                style={{
                    width: "100%",
                    paddingTop: 10,
                    paddingBottom: 4
                }}
            >
                <FileIcon />
            </div>
            <div
                className="lingo3d-flexcenter"
                style={{
                    width: "100%",
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

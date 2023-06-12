import { getExtensionType } from "@lincode/filetypes"
import { splitFileName } from "@lincode/utils"
import loadFile from "../../api/files/loadFile"
import Model from "../../display/Model"
import useSyncState from "../hooks/useSyncState"
import { getFileSelected, setFileSelected } from "../../states/useFileSelected"
import dragToCreate, { setDragImage } from "../utils/dragToCreate"
import FileIcon from "./icons/FileIcon"
import { stopPropagation } from "../utils/stopPropagation"
import { pathDataMap } from "../../collections/pathDataMap"
import { fileBrowserDirPtr } from "../../pointers/fileBrowserDirPtr"
import logStatus from "../../utils/logStatus"

type TextureType =
    | "texture"
    | "metalnessMap"
    | "roughnessMap"
    | "normalMap"
    | "aoMap"
    | "envMap"
    | "displacementMap"

const getTextureProp = (name: string): TextureType | undefined => {
    if (name.startsWith("diffuse") || name.startsWith("albedo"))
        return "texture"
    else if (name.startsWith("rough")) return "roughnessMap"
    else if (name.startsWith("metal")) return "metalnessMap"
    else if (name.startsWith("norm")) return "normalMap"
    else if (name.startsWith("disp") || name.startsWith("height"))
        return "displacementMap"
    else if (name.startsWith("env")) return "envMap"
    else if (name.startsWith("ao")) return "aoMap"
}

const setDraggingItem = dragToCreate<File>((draggingItem, hitManager) => {
    const filetype = getExtensionType(draggingItem.name)
    if (filetype === "model") {
        const manager = new Model()
        manager.src = draggingItem.webkitRelativePath
        return manager
    } else if (filetype === "image" && hitManager && "texture" in hitManager) {
        const pathData = pathDataMap.get(fileBrowserDirPtr[0])
        if (!pathData?.isMaterialFolder) return

        const [filename] = splitFileName(draggingItem.name)
        const processedFileName = (
            pathData.fileNameOverlap
                ? filename.replace(pathData.fileNameOverlap, "")
                : filename
        ).toLowerCase()

        const prop = getTextureProp(processedFileName)
        if (!prop) return

        hitManager[prop] = draggingItem.webkitRelativePath
        logStatus(`set texture: ${prop}`)
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

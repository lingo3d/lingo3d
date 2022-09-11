import { h } from "preact"
import { useMemo } from "preact/hooks"
import register from "preact-custom-element"
import { get, preventTreeShake, set, traverse } from "@lincode/utils"
import CloseIcon from "./icons/CloseIcon"
import { useFileBrowserPath, useFiles } from "../states"
import FileButton from "./FileButton"
import FileTreeItem from "./FileTreeItem"
import pathMap from "./pathMap"
import { setFileBrowser } from "../../states/useFileBrowser"

preventTreeShake(h)

interface FileStructure {
    [key: string]: FileStructure | File
}

const FileBrowser = () => {
    const [files] = useFiles()
    const [fileBrowserPath, setFileBrowserPath] = useFileBrowserPath()

    const [fileStructure, firstFolderName] = useMemo(() => {
        const fileStructure: FileStructure = {}
        let firstFolderName = ""

        if (files) {
            for (const file of files)
                set(fileStructure, file.webkitRelativePath.split("/"), file)

            firstFolderName = Object.keys(fileStructure)[0]

            traverse(fileStructure, (key, child, parent) => {
                let path = ""
                if (pathMap.has(parent)) path = pathMap.get(parent) + "/" + key
                typeof child === "object" && pathMap.set(child, path)
            })
        }
        setFileBrowserPath(firstFolderName)

        return [fileStructure, firstFolderName]
    }, [files])

    const filteredFiles = useMemo(() => {
        const currentFolder = get(fileStructure, fileBrowserPath.split("/"))
        const filteredFiles: Array<File> | undefined =
            currentFolder &&
            Object.values(currentFolder).filter(
                (item) => item instanceof File && item.name[0] !== "."
            )
        return filteredFiles
    }, [fileStructure, fileBrowserPath])

    return (
        <div
            className="lingo3d-ui lingo3d-bg"
            style={{
                height: 200,
                width: "100%",
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gridTemplateRows: "25px 1fr",
                gridColumnGap: "0px",
                gridRowGap: "0px"
            }}
        >
            <div
                style={{
                    gridArea: "1 / 1 / 2 / 3",
                    background: "rgba(0, 0, 0, 0.5)",
                    display: "flex"
                }}
            >
                <div
                    className="lingo3d-bg"
                    style={{
                        height: "100%",
                        display: "flex",
                        paddingLeft: 20,
                        paddingRight: 20,
                        alignItems: "center"
                    }}
                >
                    File Browser
                    <div style={{ width: 20 }} />
                    <div onClick={() => setFileBrowser(false)}>
                        <CloseIcon />
                    </div>
                </div>
            </div>
            <div style={{ gridArea: "2 / 1 / 3 / 2", overflow: "scroll" }}>
                <FileTreeItem
                    fileStructure={fileStructure}
                    firstFolderName={firstFolderName}
                />
            </div>
            <div style={{ gridArea: "2 / 2 / 3 / 3" }}>
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        overflow: "scroll",
                        display: "flex",
                        flexWrap: "wrap",
                        position: "absolute"
                    }}
                >
                    {filteredFiles?.map((file) => (
                        <FileButton file={file} />
                    ))}
                </div>
            </div>
        </div>
    )
}
export default FileBrowser

register(FileBrowser, "lingo3d-filebrowser")

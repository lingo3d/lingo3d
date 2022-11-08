import { useMemo } from "preact/hooks"
import register from "preact-custom-element"
import { get, set, traverse } from "@lincode/utils"
import { useFileBrowserDir, useFiles } from "../states"
import FileButton from "./FileButton"
import FileTreeItem from "./FileTreeItem"
import pathMap from "./pathMap"
import { setFileBrowser } from "../../states/useFileBrowser"
import { setFileSelected } from "../../states/useFileSelected"
import CloseableTab from "../component/CloseableTab"
import AppBar from "../component/AppBar"
import useInitCSS from "../utils/useInitCSS"

interface FileStructure {
    [key: string]: FileStructure | File
}

const FileBrowser = () => {
    useInitCSS(true)
    const [files] = useFiles()
    const [fileBrowserDir, setFileBrowserDir] = useFileBrowserDir()

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
        setFileBrowserDir(firstFolderName)

        return [fileStructure, firstFolderName]
    }, [files])

    const filteredFiles = useMemo(() => {
        const currentFolder = get(fileStructure, fileBrowserDir.split("/"))
        const filteredFiles: Array<File> | undefined =
            currentFolder &&
            Object.values(currentFolder).filter(
                (item) => item instanceof File && item.name[0] !== "."
            )
        return filteredFiles
    }, [fileStructure, fileBrowserDir])

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-panels"
            style={{
                height: 200,
                width: "100%",
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gridTemplateRows: "28px 1fr",
                gridColumnGap: "0px",
                gridRowGap: "0px"
            }}
        >
            <div style={{ gridArea: "1 / 1 / 2 / 3", display: "flex" }}>
                <AppBar>
                    <CloseableTab onClose={() => setFileBrowser(false)}>
                        file browser
                    </CloseableTab>
                </AppBar>
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
                    onMouseDown={() => setFileSelected(undefined)}
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

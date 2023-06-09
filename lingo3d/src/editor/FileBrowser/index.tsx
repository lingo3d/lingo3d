import { useMemo } from "preact/hooks"
import { get } from "@lincode/utils"
import FileButton from "./FileButton"
import FileTreeItem from "./FileTreeItem"
import useInitCSS from "../hooks/useInitCSS"
import { APPBAR_HEIGHT, PANELS_HEIGHT } from "../../globals"
import { setFileSelected } from "../../states/useFileSelected"
import useSyncState from "../hooks/useSyncState"
import { getFileBrowserDir } from "../../states/useFileBrowserDir"
import useInitEditor from "../hooks/useInitEditor"
import FileBrowserContextMenu from "./FileBrowserContextMenu"
import { getFileStructure } from "../../states/useFileStructure"
import FileBrowserAddContextMenu from "./FileBrowserAddContextMenu"

const FileBrowser = () => {
    useInitCSS()
    useInitEditor()

    const fileBrowserDir = useSyncState(getFileBrowserDir)
    const fileStructure = useSyncState(getFileStructure)

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
        <>
            <div
                className="lingo3d-ui lingo3d-bg lingo3d-panels"
                style={{
                    height: PANELS_HEIGHT - APPBAR_HEIGHT,
                    width: "100%",
                    display: "flex"
                }}
            >
                <div style={{ overflow: "scroll", width: 200 }}>
                    <FileTreeItem fileStructure={fileStructure} />
                </div>
                <div style={{ flexGrow: 1 }}>
                    <div
                        className="lingo3d-absfull"
                        style={{
                            overflow: "scroll",
                            display: "flex",
                            flexWrap: "wrap"
                        }}
                        onMouseDown={() => setFileSelected(undefined)}
                    >
                        {filteredFiles?.map((file) => (
                            <FileButton key={file.name} file={file} />
                        ))}
                    </div>
                </div>
            </div>
            <FileBrowserContextMenu />
            <FileBrowserAddContextMenu />
        </>
    )
}
export default FileBrowser

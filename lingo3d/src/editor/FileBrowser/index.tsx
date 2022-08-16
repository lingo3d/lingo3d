import { h } from "preact"
import { useState, useMemo } from "preact/hooks"
import register from "preact-custom-element"
import { get, preventTreeShake, set, traverse } from "@lincode/utils"
import CloseIcon from "./icons/CloseIcon"
import { useFiles } from "../states"
import FileButton from "./FileButton"
import FileTreeItem from "./FileTreeItem/index"
import pathMap from "./pathMap"

preventTreeShake(h)

interface FileStructure {
    [key: string]: FileStructure | File
}

const FileBrowser = () => {
    const [files] = useFiles()
    const [currentPath, setCurrentPath] = useState("")

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
        setCurrentPath(firstFolderName)

        return [fileStructure, firstFolderName]
    }, [files])

    const filteredFiles = useMemo(() => {
        const currentFolder = get(fileStructure, currentPath.split("/"))
        const filteredFiles: Array<File> | undefined =
            currentFolder &&
            Object.values(currentFolder).filter(
                (item) => item instanceof File && item.name[0] !== "."
            )
        return filteredFiles
    }, [fileStructure, currentPath])

    return (
        <div
            className="lingo3d-ui lingo3d-bg"
            style={{
                height: 200,
                width: "100%",
                maxWidth: "700px",
                overflow: "hidden"
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: 25,
                    background: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    position: "fixed",
                    zIndex: 999
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
                    <div onClick={() => console.log("here")}>
                        <CloseIcon />
                    </div>
                </div>
            </div>
            <div
                style={{
                    width: "100%",
                    height: "calc(100% - 25px)",
                    marginTop: "25px",
                    overflow: "scroll",
                    display: "flex",
                    flexDirection: "row",
                    position: "relative"
                }}
            >
                <div
                    style={{
                        width: "180px",
                        overflowX: "scroll",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.2)",
                        position: "sticky",
                        left: 0,
                        top: 0
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: "100%",
                            overflowY: "scroll",
                            padding: "10px"
                        }}
                    >
                        <FileTreeItem
                            fileStructure={fileStructure}
                            firstFolderName={firstFolderName}
                            currentPath={currentPath}
                            onClick={(path) => {
                                setCurrentPath(path)
                            }}
                        />
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignContent: "flex-start",
                        flex: 1,
                        padding: "10px"
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

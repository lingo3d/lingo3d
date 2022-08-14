import { h } from "preact"
import { useState, useEffect, useRef } from "preact/hooks"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import CloseIcon from "./icons/CloseIcon"
import { useFiles } from "../states"
import FolderIcon from "./icons/FolderIcon"
import IconHolder from "./IconHolder"
import { FileWithDirectoryAndFileHandle } from "browser-fs-access"

preventTreeShake(h)

const FileBrowser = () => {
    const [files] = useFiles()

    const [relPaths, setRelPaths] = useState<
        Array<FileWithDirectoryAndFileHandle> | undefined
    >(undefined)

    const [currentDirectory, setCurrentDirectory] = useState<
        string | undefined
    >(undefined)
    const [currentDirFiles, setCurrentDirFiles] = useState<any>([])

    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!elRef.current) return
        if (!files) return

        const relPaths = files.map((m) =>
            m.webkitRelativePath.substring(
                0,
                m.webkitRelativePath.lastIndexOf("/")
            )
        )
        const uniqueRelPath = [...new Set(relPaths)].reverse()
        uniqueRelPath.forEach((f, i) => {
            uniqueRelPath[i] = f.split("/")
        })

        var tree = arrangeIntoTree(uniqueRelPath)
        renderTree(tree)
    }, [files])

    function arrangeIntoTree(paths) {
        var tree = []

        for (var i = 0; i < paths.length; i++) {
            var path = paths[i]
            var currentLevel = tree
            for (var j = 0; j < path.length; j++) {
                var part = path[j]

                var existingPath = findWhere(currentLevel, "name", part)

                if (existingPath) {
                    currentLevel = existingPath.children
                } else {
                    var newPart = {
                        name: part,
                        children: []
                    }

                    currentLevel.push(newPart)
                    currentLevel = newPart.children
                }
            }
        }
        return tree
    }

    function findWhere(array, key, value) {
        var t = 0
        while (t < array.length && array[t][key] !== value) {
            t++
        }

        if (t < array.length) {
            return array[t]
        } else {
            return false
        }
    }

    function renderTree(tree) {
        const newTree = tree.forEach((f) => {
            Object.entries(f).forEach(([k, v]) => {
                if (k === "name") {
                    const ul = document.createElement("ul")
                    const text = document.createTextNode(v)
                    ul.appendChild(text)
                    elRef.current.appendChild(ul)
                }

                if (k === "children" && v.length > 0) {
                    renderTree(v)
                }
            })
        })

        return newTree
    }

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
                    position: "fixed"
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
                    height: "100%",
                    overflow: "scroll",
                    marginTop: 20,
                    padding: 10,
                    display: "flex",
                    flexDirection: "row",
                    position: "relative"
                }}
            >
                <div
                    style={{
                        width: "auto",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.2)",
                        position: "sticky",
                        minWidth: "150px",
                        left: 0,
                        top: 0
                    }}
                >
                    <div
                        ref={elRef}
                        style={{ height: "100%", overflowY: "scroll" }}
                    ></div>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        flex: 1
                    }}
                >
                    {currentDirFiles?.map((file) => (
                        <IconHolder name={file.name}>
                            <FolderIcon />
                        </IconHolder>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default FileBrowser

register(FileBrowser, "lingo3d-filebrowser")

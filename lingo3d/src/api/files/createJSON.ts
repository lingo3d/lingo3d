import dirPath from "../path/dirPath"
import { getFileBrowserDir } from "../../states/useFileBrowserDir"
import { setFileCurrent } from "../../states/useFileCurrent"
import { getFiles } from "../../states/useFiles"
import unsafeSetValue from "../../utils/unsafeSetValue"
import { VERSION } from "../../globals"
import {
    FileStructure,
    mergeFileStructure,
    setPathMap
} from "../../states/useFileStructure"
import { set } from "@lincode/utils"
import { pathFileMap } from "../../display/core/utils/objectURL"

export default async () => {
    const files = getFiles()
    if (!files) return

    const dir = getFileBrowserDir()
    const f = files?.find((f) => dirPath(f.webkitRelativePath) === dir)
    if (!f) return

    const { default: prettier } = await import("prettier/standalone")
    const { default: parser } = await import("prettier/parser-babel")
    const { fileSave } = await import("browser-fs-access")

    const code = prettier.format(
        JSON.stringify([{ type: "lingo3d", version: VERSION }]),
        {
            parser: "json",
            plugins: [parser]
        }
    )
    const fileHandle = await fileSave(
        new Blob([code], { type: "text/plain" }),
        {
            fileName: "scene.json",
            startIn: f.directoryHandle as any
        }
    )
    const file = await fileHandle?.getFile()
    if (!file) return

    unsafeSetValue(file, "handle", fileHandle)

    files.push(file)
    pathFileMap.set(file.webkitRelativePath, file)

    const fileStructure: FileStructure = {}
    set(fileStructure, file.webkitRelativePath.split("/"), file)
    setPathMap(fileStructure)
    mergeFileStructure(fileStructure)

    setFileCurrent(file)
}

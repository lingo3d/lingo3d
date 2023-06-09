import dirPath from "../path/dirPath"
import { getFileBrowserDir } from "../../states/useFileBrowserDir"
import { getFiles } from "../../states/useFiles"
import unsafeSetValue from "../../utils/unsafeSetValue"
import { VERSION } from "../../globals"
import {
    FileStructure,
    mergeFileStructure,
    setPathMap
} from "../../states/useFileStructure"
import { set } from "@lincode/utils"
import loadFile from "./loadFile"
import { pathFileMap } from "../../collections/pathCollections"

export default async () => {
    const files = getFiles()
    const dir = getFileBrowserDir()
    const f = dir
        ? files?.find((f) => dirPath(f.webkitRelativePath) === dir)
        : undefined

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
    const fileHandle = await fileSave(new Blob([code], { type: "text/json" }), {
        fileName: "scene.json",
        startIn: f?.directoryHandle as any
    })
    const file = await fileHandle?.getFile()
    if (!file) return

    Object.defineProperty(file, "webkitRelativePath", {
        get() {
            return dir + "/" + file.name
        }
    })
    unsafeSetValue(file, "handle", fileHandle)

    if (files) {
        files.push(file)
        pathFileMap.set(file.webkitRelativePath, file)

        const fileStructure: FileStructure = {}
        set(fileStructure, file.webkitRelativePath.split("/"), file)
        setPathMap(fileStructure)
        mergeFileStructure(fileStructure)
    }
    loadFile(file)
}

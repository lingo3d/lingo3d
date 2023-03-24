import dirPath from "../path/dirPath"
import { getFileBrowserDir } from "../../states/useFileBrowserDir"
import { setFileCurrent } from "../../states/useFileCurrent"
import { getFiles } from "../../states/useFiles"
import unsafeSetValue from "../../utils/unsafeSetValue"
import { VERSION } from "../../globals"

export default async () => {
    const dir = getFileBrowserDir()
    const f = getFiles()?.find((f) => dirPath(f.webkitRelativePath) === dir)
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
    setFileCurrent(file)
}

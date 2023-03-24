import dirPath from "../../../api/path/dirPath"
import { getFileBrowserDir } from "../../../states/useFileBrowserDir"
import { setFileCurrent } from "../../../states/useFileCurrent"
import { getFiles } from "../../../states/useFiles"
import unsafeSetValue from "../../../utils/unsafeSetValue"

export default async () => {
    const dir = getFileBrowserDir()
    const f = getFiles()?.find((f) => dirPath(f.webkitRelativePath) === dir)
    if (!f) return

    const { fileSave } = await import("browser-fs-access")

    const fileHandle = await fileSave(new Blob([""], { type: "text/plain" }), {
        fileName: "scene.json",
        startIn: f.directoryHandle as any
    })
    const file = await fileHandle?.getFile()
    if (!file) return

    unsafeSetValue(file, "handle", fileHandle)
    setFileCurrent(file)
}

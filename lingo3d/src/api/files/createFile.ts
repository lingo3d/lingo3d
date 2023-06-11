import type { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import updateFileStructure from "./utils/updateFileStructure"
import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"
import { getFileBrowserDir } from "../../states/useFileBrowserDir"

export default async (
    fileName: string,
    content = "",
    parentDirectoryHandle?: FileSystemDirectoryHandle,
    parentDirectoryPath?: string
) => {
    const directoryHandle =
        parentDirectoryHandle ?? pathDirectoryHandleMap.get(getFileBrowserDir())
    let fileHandle: FileSystemFileHandle
    if (directoryHandle) {
        fileHandle = await directoryHandle.getFileHandle(fileName, {
            create: true
        })
        if (content) {
            const writable = await fileHandle.createWritable()
            await writable.write(content)
            await writable.close()
        }
    } else {
        const { fileSave } = await import("browser-fs-access")
        fileHandle = (await fileSave(
            new Blob([content], { type: "text/json" }),
            {
                fileName,
                startIn: "downloads",
                id: "lingo3d"
            }
        ))!
    }
    const file: FileWithDirectoryAndFileHandle = await fileHandle.getFile()
    file.handle = fileHandle
    file.directoryHandle = directoryHandle
    Object.defineProperty(file, "webkitRelativePath", {
        value: `${parentDirectoryPath}/${fileName}`
    })
    updateFileStructure(file)
    return file
}

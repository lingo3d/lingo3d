import type { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import getDirectoryHandle from "./utils/getDirectoryHandle"
import updateFileStructure from "./utils/updateFileStructure"

export default async (
    fileName: string,
    content = "",
    parentDirectoryHandle?: FileSystemDirectoryHandle,
    parentDirectoryPath?: string
) => {
    const directoryHandle = parentDirectoryHandle ?? getDirectoryHandle()
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
                fileName: "scene.json",
                startIn: "downloads",
                id: "lingo3d"
            }
        ))!
    }
    const file: FileWithDirectoryAndFileHandle = await fileHandle.getFile()
    file.handle = fileHandle
    file.directoryHandle = directoryHandle
    Object.defineProperty(file, "webkitRelativePath", {
        value: `${parentDirectoryPath}/.DS_Store`
    })
    updateFileStructure(file)
    return file
}
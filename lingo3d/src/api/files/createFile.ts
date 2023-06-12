import type { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import updateFileStructure from "./utils/updateFileStructure"
import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"
import { fileBrowserDirPtr } from "../../pointers/fileBrowserDirPtr"

export default async (fileName: string, content: string) => {
    const directoryHandle = pathDirectoryHandleMap.get(fileBrowserDirPtr[0])
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
        value: `${fileBrowserDirPtr[0]}/${fileName}`
    })
    updateFileStructure(file)
    return file
}

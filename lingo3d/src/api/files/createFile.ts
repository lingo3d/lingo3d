import { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import getDirectoryHandle from "./utils/getDirectoryHandle"
import updateFileStructure from "./utils/updateFileStructure"

export default async (
    fileName: string,
    content = "",
    parentDirectoryHandle?: FileSystemDirectoryHandle,
    parentDirectoryPath?: string
) => {
    const directoryHandle = parentDirectoryHandle ?? getDirectoryHandle()
    const fileHandle = await directoryHandle.getFileHandle(fileName, {
        create: true
    })
    if (content) {
        const writable = await fileHandle.createWritable()
        await writable.write(content)
        await writable.close()
    }
    const file = (await fileHandle.getFile()) as FileWithDirectoryAndFileHandle
    file.handle = fileHandle
    file.directoryHandle = directoryHandle
    Object.defineProperty(file, "webkitRelativePath", {
        value: `${parentDirectoryPath}/.DS_Store`
    })
    updateFileStructure(file)
    return file
}

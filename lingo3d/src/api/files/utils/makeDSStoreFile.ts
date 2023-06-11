import type { FileWithDirectoryAndFileHandle } from "browser-fs-access"

export default (
    directoryHandle: FileSystemDirectoryHandle,
    dirPath: string
) => {
    const file = new File([], ".DS_Store") as FileWithDirectoryAndFileHandle
    file.directoryHandle = directoryHandle
    Object.defineProperty(file, "webkitRelativePath", {
        value: `${dirPath}/.DS_Store`
    })
    return file
}

import { FileWithDirectoryAndFileHandle } from "browser-fs-access"

export default (directoryHandle: FileSystemDirectoryHandle) => {
    const file = new File([], ".DS_Store") as FileWithDirectoryAndFileHandle
    file.directoryHandle = directoryHandle
    Object.defineProperty(file, "webkitRelativePath", {
        value: `${directoryHandle.name}/.DS_Store`
    })
    return file
}

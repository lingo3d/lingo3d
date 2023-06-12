import { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"
import createFolder from "./createFolder"
import updateFileStructure from "./utils/updateFileStructure"
import { fileBrowserDirPtr } from "../../pointers/fileBrowserDirPtr"

const copyDirectory = async (
    sourceHandle: FileSystemDirectoryHandle,
    destinationHandle: FileSystemDirectoryHandle,
    path = fileBrowserDirPtr[0] + "/" + destinationHandle.name,
    files: Array<FileWithDirectoryAndFileHandle> = []
) => {
    //@ts-ignore
    for await (const entry of sourceHandle.values()) {
        const nestedPath = `${path}/${entry.name}`
        if (entry.kind === "file") {
            const sourceFileHandle = await sourceHandle.getFileHandle(
                entry.name
            )
            const sourceFile = await sourceFileHandle.getFile()
            //@ts-ignore
            await destinationHandle.requestPermission({ mode: "readwrite" })
            const writable = await destinationHandle.getFileHandle(entry.name, {
                create: true
            })
            const writableFile = await writable.createWritable()
            await writableFile.write(sourceFile)
            await writableFile.close()

            const file: FileWithDirectoryAndFileHandle =
                await writable.getFile()
            file.directoryHandle = destinationHandle
            file.handle = writable
            Object.defineProperty(file, "webkitRelativePath", {
                value: nestedPath
            })
            files.push(file)
        } else if (
            entry.kind === "directory" &&
            !(entry.name[0] === "." || entry.name === "node_modules")
        ) {
            pathDirectoryHandleMap.set(nestedPath, entry)
            const directoryHandle = await sourceHandle.getDirectoryHandle(
                entry.name
            )
            const newDirectoryHandle =
                await destinationHandle.getDirectoryHandle(entry.name, {
                    create: true
                })
            await copyDirectory(
                directoryHandle,
                newDirectoryHandle,
                nestedPath,
                files
            )
        }
    }
    return files
}

export default async () => {
    //@ts-ignore
    const sourceHandle = await window.showDirectoryPicker({
        startIn: "downloads",
        id: "lingo3d-upload"
    })
    const destinationHandle = await createFolder(sourceHandle.name)
    const files = await copyDirectory(sourceHandle, destinationHandle)
    updateFileStructure(files)
}

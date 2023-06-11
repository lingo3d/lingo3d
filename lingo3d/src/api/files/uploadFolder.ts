import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"
import createFolder from "./createFolder"

const copyDirectory = async (
    sourceHandle: FileSystemDirectoryHandle,
    destinationHandle: FileSystemDirectoryHandle,
    path: string
) => {
    //@ts-ignore
    for await (const entry of sourceHandle.values()) {
        const nestedPath = `${path}/${entry.name}`
        if (entry.kind === "file") {
            const fileHandle = await sourceHandle.getFileHandle(entry.name)
            const file = await fileHandle.getFile()
            //@ts-ignore
            await destinationHandle.requestPermission({ mode: "readwrite" })
            const writable = await destinationHandle.getFileHandle(entry.name, {
                create: true
            })
            const writableFile = await writable.createWritable()
            await writableFile.write(file)
            await writableFile.close()
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
            await copyDirectory(directoryHandle, newDirectoryHandle, nestedPath)
        }
    }
}

export default async () => {
    //@ts-ignore
    const sourceHandle = await window.showDirectoryPicker({
        startIn: "downloads",
        id: "lingo3d-upload"
    })
    const destinationHandle = await createFolder(sourceHandle.name)
    await copyDirectory(sourceHandle, destinationHandle, destinationHandle.name)
}

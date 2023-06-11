import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"
import { getFileBrowserDir } from "../../states/useFileBrowserDir"

const copyDirectory = async (
    sourceHandle: FileSystemDirectoryHandle,
    destinationHandle: FileSystemDirectoryHandle
) => {
    //@ts-ignore
    for await (const entry of sourceHandle.values()) {
        if (entry.kind === "file") {
            const fileHandle = await sourceHandle.getFileHandle(entry.name)
            const file = await fileHandle.getFile()
            //@ts-ignore
            await destinationHandle.writeFile(entry.name, file)
        } else if (entry.kind === "directory") {
            const directoryHandle = await sourceHandle.getDirectoryHandle(
                entry.name
            )
            const newDirectoryHandle =
                await destinationHandle.getDirectoryHandle(entry.name, {
                    create: true
                })
            await copyDirectory(directoryHandle, newDirectoryHandle)
        }
    }
}

export default async () => {
    //@ts-ignore
    const sourceHandle = await window.showDirectoryPicker()
    const destinationHandle = pathDirectoryHandleMap.get(getFileBrowserDir())!
    await copyDirectory(sourceHandle, destinationHandle)
}

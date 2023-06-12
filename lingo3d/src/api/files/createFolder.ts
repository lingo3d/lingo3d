import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"
import { fileBrowserDirPtr } from "../../pointers/fileBrowserDirPtr"

export default async (folderName: string) => {
    const directoryHandle = pathDirectoryHandleMap.get(fileBrowserDirPtr[0])
    const newDirectoryHandle = await directoryHandle!.getDirectoryHandle(
        folderName,
        { create: true }
    )
    pathDirectoryHandleMap.set(
        `${fileBrowserDirPtr[0]}/${folderName}`,
        newDirectoryHandle
    )
    return newDirectoryHandle
}

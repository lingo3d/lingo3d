import createFile from "./createFile"
import { getFileBrowserDir } from "../../states/useFileBrowserDir"
import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"

export default async (folderName: string) => {
    const parentDirectoryHandle = pathDirectoryHandleMap.get(
        getFileBrowserDir()
    )
    const newDirectoryHandle = await parentDirectoryHandle!.getDirectoryHandle(
        folderName,
        { create: true }
    )
    await createFile(
        ".DS_Store",
        "",
        newDirectoryHandle,
        `${getFileBrowserDir()}/${folderName}`
    )
    return newDirectoryHandle
}

import getDirectoryHandle from "./utils/getDirectoryHandle"
import createFile from "./createFile"
import { getFileBrowserDir } from "../../states/useFileBrowserDir"

export default async (folderName: string) => {
    const parentDirectoryHandle = getDirectoryHandle()
    const newDirectoryHandle = await parentDirectoryHandle.getDirectoryHandle(
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

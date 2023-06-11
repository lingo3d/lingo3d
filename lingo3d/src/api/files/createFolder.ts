import { getFiles } from "../../states/useFiles"
import makeDSStoreFile from "./utils/makeDSStoreFile"
import refreshFiles from "./utils/refreshFiles"
import getDirectoryHandle from "./utils/getDirectoryHandle"
import { getFileBrowserDir } from "../../states/useFileBrowserDir"

export default async (folderName: string) => {
    const parentDirectoryHandle = getDirectoryHandle()
    const newDirectoryHandle = await parentDirectoryHandle.getDirectoryHandle(
        folderName,
        { create: true }
    )
    const files = getFiles()
    if (!files) return

    const file = makeDSStoreFile(
        newDirectoryHandle,
        getFileBrowserDir() + "/" + folderName
    )
    if (files.find((f) => f.webkitRelativePath === file.webkitRelativePath))
        return

    refreshFiles(files, file)
}

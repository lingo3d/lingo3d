import { get } from "@lincode/utils"
import { getFileBrowserDir } from "../../states/useFileBrowserDir"
import { getFileStructure } from "../../states/useFileStructure"
import { getFiles } from "../../states/useFiles"
import makeDSStoreFile from "./utils/makeDSStoreFile"
import refreshFiles from "./utils/refreshFiles"

export default async (folderName: string) => {
    const dir = getFileBrowserDir()
    const directoryHandle = Object.values(
        get(getFileStructure(), dir.split("/"))
        //@ts-ignore
    )[0]?.directoryHandle

    const parentDirectoryHandle: FileSystemDirectoryHandle =
        //@ts-ignore
        directoryHandle ?? (await window.showDirectoryPicker())

    const newDirectoryHandle = await parentDirectoryHandle.getDirectoryHandle(
        folderName,
        { create: true }
    )
    const files = getFiles()
    if (!files) return

    const file = makeDSStoreFile(newDirectoryHandle, dir + "/" + folderName)
    if (files.find((f) => f.webkitRelativePath === file.webkitRelativePath))
        return

    refreshFiles(files, file)
}

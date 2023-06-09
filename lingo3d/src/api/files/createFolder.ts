import { getFileBrowserDir } from "../../states/useFileBrowserDir"
import { getFileStructure } from "../../states/useFileStructure"

export default async () => {
    const directoryHandle = Object.values(
        getFileStructure()[getFileBrowserDir()]
    )[0]?.directoryHandle
    const parentDirectoryHandle: FileSystemDirectoryHandle =
        //@ts-ignore
        directoryHandle ?? (await window.showDirectoryPicker())
    const folderName = "hello"
    return await parentDirectoryHandle.getDirectoryHandle(folderName, {
        create: true
    })
}

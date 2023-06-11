import { get } from "@lincode/utils"
import { getFileBrowserDir } from "../../../states/useFileBrowserDir"
import { getFileStructure } from "../../../states/useFileStructure"

export default async (): Promise<FileSystemDirectoryHandle> => {
    const dir = getFileBrowserDir()
    const directoryHandle = Object.values(
        get(getFileStructure(), dir.split("/"))
        //@ts-ignore
    )[0]?.directoryHandle
    //@ts-ignore
    return directoryHandle ?? (await window.showDirectoryPicker())
}

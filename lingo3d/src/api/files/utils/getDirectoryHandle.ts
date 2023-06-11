import { get } from "@lincode/utils"
import { getFileBrowserDir } from "../../../states/useFileBrowserDir"
import { getFileStructure } from "../../../states/useFileStructure"
import type { FileWithDirectoryAndFileHandle } from "browser-fs-access"

export default (): FileSystemDirectoryHandle | undefined => {
    const subFileStructure = get(
        getFileStructure(),
        getFileBrowserDir().split("/")
    )
    if (!subFileStructure) return
    const firstFileInDir = Object.values(subFileStructure).find(
        (file) => file instanceof File
    ) as FileWithDirectoryAndFileHandle
    return firstFileInDir.directoryHandle
}

import { get } from "@lincode/utils"
import { getFileBrowserDir } from "../../../states/useFileBrowserDir"
import { getFileStructure } from "../../../states/useFileStructure"

export default (): FileSystemDirectoryHandle =>
    Object.values(
        get(getFileStructure(), getFileBrowserDir().split("/"))
        //@ts-ignore
    )[0]!.directoryHandle

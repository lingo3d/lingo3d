import { get } from "@lincode/utils"
import { getFileBrowserDir } from "../../../states/useFileBrowserDir"
import { getFileStructure } from "../../../states/useFileStructure"
import unsafeGetValue from "../../../utils/unsafeGetValue"

export default (): FileSystemDirectoryHandle =>
    unsafeGetValue(
        Object.values(
            get(getFileStructure(), getFileBrowserDir().split("/"))
        )[0]!,
        "directoryHandle"
    )

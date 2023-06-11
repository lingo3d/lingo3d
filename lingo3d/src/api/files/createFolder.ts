import makeDSStoreFile from "./utils/makeDSStoreFile"
import updateFileStructure from "./utils/updateFileStructure"
import getDirectoryHandle from "./utils/getDirectoryHandle"
import { getFileBrowserDir } from "../../states/useFileBrowserDir"

export default async (folderName: string) => {
    const parentDirectoryHandle = getDirectoryHandle()
    const newDirectoryHandle = await parentDirectoryHandle.getDirectoryHandle(
        folderName,
        { create: true }
    )
    updateFileStructure(
        makeDSStoreFile(
            newDirectoryHandle,
            getFileBrowserDir() + "/" + folderName
        )
    )
}

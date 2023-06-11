import getDirectoryHandle from "./utils/getDirectoryHandle"
import createFile from "./createFile"

export default async (folderName: string) => {
    const parentDirectoryHandle = getDirectoryHandle()
    const newDirectoryHandle = await parentDirectoryHandle.getDirectoryHandle(
        folderName,
        { create: true }
    )
    await createFile(".DS_Store", "", newDirectoryHandle)
    return newDirectoryHandle
}

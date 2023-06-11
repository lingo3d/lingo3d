import unsafeSetValue from "../../utils/unsafeSetValue"
import getDirectoryHandle from "./utils/getDirectoryHandle"

export default async (fileName: string, content = "") => {
    const directoryHandle = getDirectoryHandle()
    const fileHandle = await directoryHandle.getFileHandle(fileName, {
        create: true
    })
    if (content) {
        const writable = await fileHandle.createWritable()
        await writable.write(content)
        await writable.close()
    }
    const file = await fileHandle.getFile()
    unsafeSetValue(file, "handle", fileHandle)
}

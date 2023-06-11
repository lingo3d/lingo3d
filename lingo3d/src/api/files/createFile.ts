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
    return fileHandle.getFile()
}

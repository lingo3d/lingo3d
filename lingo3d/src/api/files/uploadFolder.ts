import { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"
import {
    FileStructure,
    mergeFileStructure
} from "../../states/useFileStructure"
import createFolder from "./createFolder"
import { getFileBrowserDir } from "../../states/useFileBrowserDir"
import { set } from "@lincode/utils"
import { pathFileMap } from "../../collections/pathFileMap"
import { setFileStructurePathMap } from "../../collections/fileStructurePathMap"

const copyDirectory = async (
    sourceHandle: FileSystemDirectoryHandle,
    destinationHandle: FileSystemDirectoryHandle,
    fileStructure: FileStructure,
    path = getFileBrowserDir() + "/" + destinationHandle.name
) => {
    //@ts-ignore
    for await (const entry of sourceHandle.values()) {
        const nestedPath = `${path}/${entry.name}`
        if (entry.kind === "file") {
            const sourceFileHandle = await sourceHandle.getFileHandle(
                entry.name
            )
            const sourceFile = await sourceFileHandle.getFile()
            //@ts-ignore
            await destinationHandle.requestPermission({ mode: "readwrite" })
            const writable = await destinationHandle.getFileHandle(entry.name, {
                create: true
            })
            const writableFile = await writable.createWritable()
            await writableFile.write(sourceFile)
            await writableFile.close()

            const file: FileWithDirectoryAndFileHandle =
                await writable.getFile()
            file.directoryHandle = destinationHandle
            file.handle = writable
            Object.defineProperty(file, "webkitRelativePath", {
                value: nestedPath
            })
            set(fileStructure, file.webkitRelativePath.split("/"), file)
            pathFileMap.set(file.webkitRelativePath, file)
        } else if (
            entry.kind === "directory" &&
            !(entry.name[0] === "." || entry.name === "node_modules")
        ) {
            pathDirectoryHandleMap.set(nestedPath, entry)
            const directoryHandle = await sourceHandle.getDirectoryHandle(
                entry.name
            )
            const newDirectoryHandle =
                await destinationHandle.getDirectoryHandle(entry.name, {
                    create: true
                })
            await copyDirectory(
                directoryHandle,
                newDirectoryHandle,
                fileStructure,
                nestedPath
            )
        }
    }
}

export default async () => {
    //@ts-ignore
    const sourceHandle = await window.showDirectoryPicker({
        startIn: "downloads",
        id: "lingo3d-upload"
    })
    const destinationHandle = await createFolder(sourceHandle.name)
    const fileStructure: FileStructure = {}
    await copyDirectory(sourceHandle, destinationHandle, fileStructure)
    setFileStructurePathMap(fileStructure)
    mergeFileStructure(fileStructure)
}

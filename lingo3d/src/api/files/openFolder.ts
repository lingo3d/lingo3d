import {
    directoryOpen,
    FileWithDirectoryAndFileHandle
} from "browser-fs-access"
import { setFiles } from "../../states/useFiles"
import loadFile from "./loadFile"

const isFileArray = (files: any): files is FileWithDirectoryAndFileHandle[] =>
    files[0] && "webkitRelativePath" in files[0]

const makeDSStoreFile = (directoryHandle: FileSystemDirectoryHandle) => {
    const file = new File([], ".DS_Store") as FileWithDirectoryAndFileHandle
    Object.defineProperty(file, "webkitRelativePath", {
        value: `${directoryHandle.name}/.DS_Store`
    })
    return file
}

export default async () => {
    const f = await directoryOpen({
        recursive: true,
        startIn: "downloads",
        id: "lingo3d",
        skipDirectory: (entry) =>
            entry.name[0] === "." || entry.name === "node_modules"
    })
    const files = isFileArray(f) ? f : [makeDSStoreFile(f[0])]
    setFiles(files)
    for (const file of files)
        if (file.webkitRelativePath.split("/").length < 3)
            if (await loadFile(file)) return
}

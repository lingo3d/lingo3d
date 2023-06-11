import {
    directoryOpen,
    FileWithDirectoryAndFileHandle
} from "browser-fs-access"
import loadFile from "./loadFile"
import makeDSStoreFile from "./utils/makeDSStoreFile"
import { emitOpenFolder } from "../../events/onOpenFolder"
import initFileStructure from "./utils/initFileStructure"

const isFileArray = (files: any): files is FileWithDirectoryAndFileHandle[] =>
    files[0] && "webkitRelativePath" in files[0]

export default async () => {
    const f = await directoryOpen({
        recursive: true,
        startIn: "downloads",
        id: "lingo3d",
        skipDirectory: (entry) =>
            entry.name[0] === "." || entry.name === "node_modules"
    })
    const files = isFileArray(f) ? f : [makeDSStoreFile(f[0], f[0].name)]
    initFileStructure(files)

    for (const file of files)
        if (file.webkitRelativePath.split("/").length < 3)
            if (await loadFile(file)) break

    emitOpenFolder()
}

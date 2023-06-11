import type { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import loadFile from "./loadFile"
import makeDSStoreFile from "./utils/makeDSStoreFile"
import { emitOpenFolder } from "../../events/onOpenFolder"
import directoryOpen from "./utils/directory-open"
import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"
import { set } from "@lincode/utils"
import { setFileStructurePathMap } from "../../collections/fileStructurePathMap"
import { pathFileMap } from "../../collections/pathFileMap"
import { firstFolderNamePtr } from "../../pointers/firstFolderNamePtr"
import { setFileBrowserDir } from "../../states/useFileBrowserDir"
import { FileStructure, setFileStructure } from "../../states/useFileStructure"
import closeFolder from "./closeFolder"

const isFileArray = (files: any): files is FileWithDirectoryAndFileHandle[] =>
    files[0] && "webkitRelativePath" in files[0]

export default async () => {
    closeFolder()

    const f = await directoryOpen({
        recursive: true,
        startIn: "downloads",
        id: "lingo3d",
        skipDirectory: (
            entry: FileSystemDirectoryHandle,
            nestedPath: string
        ) => {
            pathDirectoryHandleMap.set(nestedPath, entry)
            return entry.name[0] === "." || entry.name === "node_modules"
        }
    })
    const files = isFileArray(f) ? f : [makeDSStoreFile(f[0], f[0].name)]

    const fileStructure: FileStructure = {}
    for (const file of files) {
        set(fileStructure, file.webkitRelativePath.split("/"), file)
        pathFileMap.set(file.webkitRelativePath, file)
    }
    firstFolderNamePtr[0] = Object.keys(fileStructure)[0] ?? ""
    setFileStructurePathMap(fileStructure)
    setFileStructure(fileStructure)
    setFileBrowserDir(firstFolderNamePtr[0])

    for (const file of files)
        if (file.webkitRelativePath.split("/").length < 3)
            if (await loadFile(file)) break

    emitOpenFolder()
}

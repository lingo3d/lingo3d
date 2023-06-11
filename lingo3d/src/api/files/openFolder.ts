import loadFile from "./loadFile"
import { emitOpenFolder } from "../../events/onOpenFolder"
import directoryOpen from "./utils/directory-open"
import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"
import { set } from "@lincode/utils"
import { setFileStructurePathMap } from "../../collections/fileStructurePathMap"
import { pathFileMap } from "../../collections/pathFileMap"
import { rootFolderNamePtr } from "../../pointers/rootFolderNamePtr"
import { setFileBrowserDir } from "../../states/useFileBrowserDir"
import { FileStructure, setFileStructure } from "../../states/useFileStructure"
import closeFolder from "./closeFolder"

export default async () => {
    closeFolder()

    const [handle, files] = await directoryOpen({
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
    const fileStructure: FileStructure = {}
    for (const file of files) {
        set(fileStructure, file.webkitRelativePath.split("/"), file)
        pathFileMap.set(file.webkitRelativePath, file)
    }
    rootFolderNamePtr[0] = Object.keys(fileStructure)[0] ?? ""
    pathDirectoryHandleMap.set(rootFolderNamePtr[0], handle)
    setFileStructurePathMap(fileStructure)
    setFileStructure(fileStructure)
    setFileBrowserDir(rootFolderNamePtr[0])

    for (const file of files)
        if (file.webkitRelativePath.split("/").length < 3)
            if (await loadFile(file)) break

    emitOpenFolder()
}

import loadFile from "./loadFile"
import { emitOpenFolder } from "../../events/onOpenFolder"
import directoryOpen from "./utils/directory-open"
import { pathDirectoryHandleMap } from "../../collections/pathDirectoryHandleMap"
import { set } from "@lincode/utils"
import { setFileStructurePathMap } from "../../collections/fileStructurePathMap"
import { pathFileMap } from "../../collections/pathFileMap"
import { setFileBrowserDir } from "../../states/useFileBrowserDir"
import { FileStructure, setFileStructure } from "../../states/useFileStructure"
import closeFolder from "./closeFolder"
import setURLModifier from "../../display/utils/loaders/utils/setURLModifier"
import { pathObjectURLMap } from "../../collections/pathObjectURLMap"

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
    const rootFolderName = Object.keys(fileStructure)[0] ?? ""
    pathDirectoryHandleMap.set(rootFolderName, handle)
    setFileStructurePathMap(fileStructure)
    setFileStructure(fileStructure)
    setFileBrowserDir(rootFolderName)

    setURLModifier((url) => {
        if (pathObjectURLMap.has(url)) return pathObjectURLMap.get(url)!
        if (pathFileMap.has(url)) {
            const objectURL = URL.createObjectURL(pathFileMap.get(url)!)
            pathObjectURLMap.set(url, objectURL)
            return objectURL
        }
        return url
    })

    for (const file of files)
        if (file.webkitRelativePath.split("/").length < 3)
            if (await loadFile(file)) break

    emitOpenFolder()
}

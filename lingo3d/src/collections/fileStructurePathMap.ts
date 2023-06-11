import { traverse } from "@lincode/utils"
import { FileStructure } from "../states/useFileStructure"

export const fileStructurePathMap = new WeakMap<Record<string, any>, string>()

export const setFileStructurePathMap = (fileStructure: FileStructure) =>
    traverse(fileStructure, (key, child, parent) => {
        let path = ""
        if (fileStructurePathMap.has(parent))
            path = fileStructurePathMap.get(parent) + "/" + key
        typeof child === "object" && fileStructurePathMap.set(child, path)
    })

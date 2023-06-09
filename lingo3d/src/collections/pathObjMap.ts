import { traverse } from "@lincode/utils"
import { FileStructure } from "../states/useFileStructure"

export const pathObjMap = new WeakMap<Record<string, any>, string>()

export const initPathObjMap = (fileStructure: FileStructure) =>
    traverse(fileStructure, (key, child, parent) => {
        let path = ""
        if (pathObjMap.has(parent)) path = pathObjMap.get(parent) + "/" + key
        typeof child === "object" && pathObjMap.set(child, path)
    })

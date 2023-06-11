import { traverse } from "@lincode/utils"
import { FileStructure } from "../states/useFileStructure"

export const webkitRelativePathObjMap = new WeakMap<
    Record<string, any>,
    string
>()

export const initWebkitRelativePathObjMap = (fileStructure: FileStructure) =>
    traverse(fileStructure, (key, child, parent) => {
        let path = ""
        if (webkitRelativePathObjMap.has(parent))
            path = webkitRelativePathObjMap.get(parent) + "/" + key
        typeof child === "object" && webkitRelativePathObjMap.set(child, path)
    })

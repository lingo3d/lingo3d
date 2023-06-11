import type { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import { resetMainCameraManager } from "../../engine/mainCameraManager"
import { setFileCurrent } from "../../states/useFileCurrent"
import deserialize from "../serializer/deserialize"
import { appendableRoot } from "../../collections/appendableRoot"

export default async (file: FileWithDirectoryAndFileHandle) => {
    if (!file.name.toLowerCase().endsWith(".json")) return false
    try {
        const text = await file.text()
        if (!text.includes(`"type": "lingo3d"`)) return false

        unloadFile()
        setFileCurrent(file)
        await new Promise((resolve) => setTimeout(resolve))
        deserialize(JSON.parse(text))

        return true
    } catch {
        return false
    }
}

export const unloadFile = () => {
    for (const child of appendableRoot) !child.$disableUnload && child.dispose()
    resetMainCameraManager()
    setFileCurrent(undefined)
}

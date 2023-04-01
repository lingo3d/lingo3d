import { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import mainCameraManager from "../../engine/mainCameraManager"
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
    for (const child of appendableRoot) child.dispose()
    mainCameraManager.x = 0
    mainCameraManager.y = 0
    mainCameraManager.z = 0
    mainCameraManager.rotationX = 0
    mainCameraManager.rotationY = 0
    mainCameraManager.rotationZ = 0
    setFileCurrent(undefined)
}

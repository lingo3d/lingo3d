import { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import mainCameraManager from "../../engine/mainCameraManager"
import { emitLoadFile } from "../../events/onLoadFile"
import { setFileCurrent } from "../../states/useFileCurrent"
import { appendableRoot } from "../core/collections"
import deserialize from "../serializer/deserialize"

export default async (file: FileWithDirectoryAndFileHandle) => {
    if (!file.name.toLowerCase().endsWith(".json")) return false
    try {
        const text = await file.text()
        if (!text.includes(`"type": "lingo3d"`)) return false

        for (const child of appendableRoot) child.dispose()
        mainCameraManager.x = 0
        mainCameraManager.y = 0
        mainCameraManager.z = 0
        mainCameraManager.rotationX = 0
        mainCameraManager.rotationY = 0
        mainCameraManager.rotationZ = 0

        setFileCurrent(file)
        await new Promise((resolve) => setTimeout(resolve))
        deserialize(JSON.parse(text))

        emitLoadFile()
        return true
    } catch {
        return false
    }
}

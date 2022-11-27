import { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import mainOrbitCamera from "../../engine/mainOrbitCamera"
import { setFileCurrent } from "../../states/useFileCurrent"
import { appendableRoot } from "../core/collections"
import deserialize from "../serializer/deserialize"

export default async (file: FileWithDirectoryAndFileHandle) => {
    if (!file.name.toLowerCase().endsWith(".json")) return false
    try {
        const text = await file.text()
        if (!text.includes(`"type": "lingo3d"`)) return false

        for (const child of appendableRoot) child.dispose()
        mainOrbitCamera.x = 0
        mainOrbitCamera.y = 0
        mainOrbitCamera.z = 0
        mainOrbitCamera.rotationX = 0
        mainOrbitCamera.rotationY = 0
        mainOrbitCamera.rotationZ = 0

        setFileCurrent(file)
        await new Promise((resolve) => setTimeout(resolve))
        deserialize(JSON.parse(text))
        return true
    } catch {
        return false
    }
}

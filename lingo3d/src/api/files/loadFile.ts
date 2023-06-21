import type { FileWithDirectoryAndFileHandle } from "browser-fs-access"
import { setFileCurrent } from "../../states/useFileCurrent"
import deserialize from "../serializer/deserialize"
import { unloadFile } from "./unloadFile"

export default async (file: FileWithDirectoryAndFileHandle) => {
    if (!file.name.toLowerCase().endsWith(".json")) return false
    try {
        const text = await file.text()
        if (!text.includes(`"type": "lingo3d"`)) return false

        unloadFile()
        setFileCurrent(file)
        await new Promise((resolve) => setTimeout(resolve))
        deserialize(JSON.parse(text) as any)

        return true
    } catch {
        return false
    }
}

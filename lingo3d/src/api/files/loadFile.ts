import { setFileCurrent } from "../../states/useFileCurrent"
import { appendableRoot } from "../core/Appendable"
import deserialize from "../serializer/deserialize"

export default async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".json")) return false
    try {
        const text = await file.text()
        if (!text.includes(`"type": "lingo3d"`)) return false
        for (const child of appendableRoot) child.dispose()
        setFileCurrent(file)
        await Promise.resolve()
        deserialize(JSON.parse(text))
        return true
    } catch {
        return false
    }
}

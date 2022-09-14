import { setFileCurrent } from "../../states/useFileCurrent"
import { appendableRoot } from "../core/Appendable"
import deserialize from "../serializer/deserialize"

export default async () => {
    const { fileOpen } = await import("browser-fs-access")

    const file = await fileOpen({ extensions: [".json"], id: "lingo3d" })
    const text = await file.text()

    for (const child of appendableRoot) child.dispose()

    try {
        deserialize(JSON.parse(text))
        setFileCurrent(file)
    } catch {}
}

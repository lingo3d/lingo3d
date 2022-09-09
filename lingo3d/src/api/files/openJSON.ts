import { setFileHandle } from "../../states/useFileHandle"
import { appendableRoot } from "../core/Appendable"
import deserialize from "../serializer/deserialize"

export default async () => {
    const { fileOpen } = await import("browser-fs-access")

    const file = await fileOpen({ extensions: [".json"] })
    const text = await file.text()

    for (const child of appendableRoot) child.dispose()

    try {
        deserialize(JSON.parse(text))
        setFileHandle(file.handle)
    } catch {}
}

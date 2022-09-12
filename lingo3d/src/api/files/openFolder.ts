import { directoryOpen } from "browser-fs-access"
import { setFileBrowser } from "../../states/useFileBrowser"
import { setFileHandle } from "../../states/useFileHandle"
import { setFiles } from "../../states/useFiles"
import { appendableRoot } from "../core/Appendable"
import deserialize from "../serializer/deserialize"

export default async () => {
    const files = await directoryOpen({
        recursive: true,
        startIn: "downloads",
        id: "lingo3d",
        skipDirectory: (entry) =>
            entry.name[0] === "." || entry.name === "node_modules"
    })
    setFiles(files)
    setFileBrowser(true)

    for (const file of files) {
        if (!file.name.toLowerCase().endsWith(".json")) continue

        try {
            const text = await file.text()
            if (text.includes(`"type": "lingo3d"`)) {
                for (const child of appendableRoot) child.dispose()
                deserialize(JSON.parse(text))
                setFileHandle(file.handle)
                return
            }
        } catch {}
    }
}

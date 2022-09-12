import { directoryOpen } from "browser-fs-access"
import { setFileBrowser } from "../../states/useFileBrowser"
import { setFiles } from "../../states/useFiles"

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

        const text = await file.text()
        console.log(text)
    }
}

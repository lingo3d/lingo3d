import { directoryOpen } from "browser-fs-access"
import { setFileBrowser } from "../../states/useFileBrowser"
import { setFiles } from "../../states/useFiles"

export default async () => {
    const blobs = await directoryOpen({
        recursive: true,
        startIn: "downloads",
        id: "lingo3d",
        skipDirectory: (entry) =>
            entry.name[0] === "." || entry.name === "node_modules"
    })
    setFiles(blobs)
    setFileBrowser(true)
}

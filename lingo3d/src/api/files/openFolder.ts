import { directoryOpen } from "browser-fs-access"
import { setFileBrowser } from "../../states/useFileBrowser"
import { setFiles } from "../../states/useFiles"
import loadFile from "./loadFile"

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
    for (const file of files)
        if (file.webkitRelativePath.split("/").length < 3)
            if (await loadFile(file)) return
}

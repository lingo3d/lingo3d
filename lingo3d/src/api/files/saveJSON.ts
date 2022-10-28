import serialize from "../serializer/serialize"
import { getFileCurrent, setFileCurrent } from "../../states/useFileCurrent"

export default async () => {
    const { default: prettier } = await import("prettier/standalone")
    const { default: parser } = await import("prettier/parser-babel")
    const { fileSave } = await import("browser-fs-access")

    const formatAndSave = async (handle?: FileSystemFileHandle | null) => {
        if (!handle) return
        const code = prettier.format(JSON.stringify(await serialize(true)), {
            parser: "json",
            plugins: [parser]
        })
        await fileSave(
            new Blob([code], { type: "text/plain" }),
            undefined,
            handle
        )
    }
    const fileCurrent = getFileCurrent()
    if (fileCurrent) return formatAndSave(fileCurrent.handle)

    const fileHandle = await fileSave(new Blob([""], { type: "text/plain" }), {
        extensions: [".json"],
        startIn: "downloads",
        id: "lingo3d"
    })
    const file = await fileHandle?.getFile()
    if (file) {
        //@ts-ignore
        file.handle = fileHandle
        setFileCurrent(file)
    }
    return formatAndSave(fileHandle)
}

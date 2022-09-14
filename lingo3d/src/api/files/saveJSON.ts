import serialize from "../serializer/serialize"
import { getFileCurrent, setFileCurrent } from "../../states/useFileCurrent"

export default async () => {
    const { default: prettier } = await import("prettier/standalone")
    const { default: parser } = await import("prettier/parser-babel")

    const code = prettier.format(JSON.stringify(serialize()), {
        parser: "json",
        plugins: [parser]
    })

    const { fileSave } = await import("browser-fs-access")
    const fileCurrent = getFileCurrent()
    if (!fileCurrent) {
        const fileHandle = await fileSave(
            new Blob([code], { type: "text/plain" }),
            {
                extensions: [".json"],
                startIn: "downloads",
                id: "lingo3d"
            }
        )
        const file = await fileHandle?.getFile()
        //@ts-ignore
        file.handle = fileHandle
        setFileCurrent(file)
    } else
        await fileSave(
            new Blob([code], { type: "text/plain" }),
            undefined,
            fileCurrent.handle
        )
}

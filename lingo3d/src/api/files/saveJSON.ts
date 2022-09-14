import serialize from "../serializer/serialize"
import { getFileHandle, setFileHandle } from "../../states/useFileHandle"

export default async () => {
    const { default: prettier } = await import("prettier/standalone")
    const { default: parser } = await import("prettier/parser-babel")

    const code = prettier.format(JSON.stringify(serialize()), {
        parser: "json",
        plugins: [parser]
    })

    // const { fileSave } = await import("browser-fs-access")
    // const fileHandle = getFileHandle()
    // if (!fileHandle)
    //     setFileHandle(
    //         await fileSave(new Blob([code], { type: "text/plain" }), {
    //             extensions: [".json"],
    //             startIn: "downloads",
    //             id: "lingo3d"
    //         })
    //     )
    // else
    //     await fileSave(
    //         new Blob([code], { type: "text/plain" }),
    //         undefined,
    //         fileHandle
    //     )
}

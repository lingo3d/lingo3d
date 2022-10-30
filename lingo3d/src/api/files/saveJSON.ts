import serialize from "../serializer/serialize"
import { getFileCurrent } from "../../states/useFileCurrent"

export default async () => {
    const { default: prettier } = await import("prettier/standalone")
    const { default: parser } = await import("prettier/parser-babel")
    const { fileSave } = await import("browser-fs-access")

    const code = prettier.format(JSON.stringify(await serialize(true)), {
        parser: "json",
        plugins: [parser]
    })
    await fileSave(
        new Blob([code], { type: "text/plain" }),
        {
            fileName: "scene.json",
            extensions: [".json"],
            startIn: "downloads",
            id: "lingo3d"
        },
        getFileCurrent()?.handle
    )
}

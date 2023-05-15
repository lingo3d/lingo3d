import serialize from "../serializer/serialize"
import { getFileCurrent, setFileCurrent } from "../../states/useFileCurrent"
import unsafeSetValue from "../../utils/unsafeSetValue"
import { flushMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"

const saveJSON = async (code: string) => {
    const { fileSave } = await import("browser-fs-access")

    const fileCurrent = getFileCurrent()
    const fileHandle = await fileSave(
        new Blob([code], { type: "text/plain" }),
        {
            fileName: "scene.json",
            extensions: [".json"],
            startIn: "downloads",
            id: "lingo3d"
        },
        fileCurrent?.handle
    )
    if (fileCurrent) return

    const file = await fileHandle?.getFile()
    if (!file) return

    unsafeSetValue(file, "handle", fileHandle)
    setFileCurrent(file)
}

export default async () => {
    const { default: prettier } = await import("prettier/standalone")
    const { default: parser } = await import("prettier/parser-babel")

    flushMultipleSelectionTargets(
        () =>
            void saveJSON(
                prettier.format(JSON.stringify(serialize(true)), {
                    parser: "json",
                    plugins: [parser]
                })
            ),
        true
    )
}

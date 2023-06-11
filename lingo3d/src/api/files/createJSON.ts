import { VERSION } from "../../globals"
import loadFile from "./loadFile"
import createFile from "./createFile"

export default async () => {
    const { default: prettier } = await import("prettier/standalone")
    const { default: parser } = await import("prettier/parser-babel")
    loadFile(
        await createFile(
            "scene.json",
            prettier.format(
                JSON.stringify([{ type: "lingo3d", version: VERSION }]),
                { parser: "json", plugins: [parser] }
            )
        )
    )
}

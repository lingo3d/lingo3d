import { disableSchema } from "../collections/disableSchema"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import Choices from "./utils/Choices"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export type ScriptLanguage = "JavaScript" | "TypeScript"
export type ScriptMode = "script" | "editorScript"

export default interface IScript extends IAppendable {
    code: string
    language: ScriptLanguage
    mode: ScriptMode
}

export const scriptSchema: Required<ExtractProps<IScript>> = {
    ...appendableSchema,
    code: String,
    language: String,
    mode: String
}
disableSchema.add("code")

export const scriptDefaults = extendDefaults<IScript>(
    [appendableDefaults],
    {
        code: "",
        language: "TypeScript",
        mode: "script"
    },
    {
        language: new Choices({
            JavaScript: "JavaScript",
            TypeScript: "TypeScript"
        }),
        mode: new Choices({
            script: "script",
            editorScript: "editorScript"
        })
    }
)

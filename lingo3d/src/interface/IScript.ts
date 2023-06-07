import { disableSchema } from "../collections/disableSchema"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import Choices from "./utils/Choices"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export type ScriptLanguage = "JavaScript" | "TypeScript"
export type ScriptType = "script" | "system"

export default interface IScript extends IAppendable {
    code: string
    language: ScriptLanguage
    type: ScriptType
}

export const scriptSchema: Required<ExtractProps<IScript>> = {
    ...appendableSchema,
    code: String,
    language: String,
    type: String
}
disableSchema.add("code")

export const scriptDefaults = extendDefaults<IScript>(
    [appendableDefaults],
    {
        code: "",
        language: "TypeScript"
    },
    {
        language: new Choices({
            JavaScript: "JavaScript",
            TypeScript: "TypeScript"
        }),
        type: new Choices({ script: "script", system: "system" })
    }
)

import { disableSchema } from "../collections/disableSchema"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export type ScriptLanguage = "JavaScript" | "TypeScript"

export default interface IScript extends IAppendable {
    code: string
    language: ScriptLanguage
}

export const scriptSchema: Required<ExtractProps<IScript>> = {
    ...appendableSchema,
    code: String,
    language: String
}
disableSchema.add("code")

export const scriptDefaults = extendDefaults<IScript>([appendableDefaults], {
    code: "",
    language: "TypeScript"
})

import IModel, { modelDefaults, modelSchema } from "./IModel"
import { ExtractProps } from "./utils/extractProps"

export default interface IDummy extends IModel {
    preset: "default" | "rifle"
}

export const dummySchema: Required<ExtractProps<IDummy>> = {
    ...modelSchema,
    preset: String
}

export const dummyDefaults: IDummy = {
    ...modelDefaults,
    preset: "default"
}
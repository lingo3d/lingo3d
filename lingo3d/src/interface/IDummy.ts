import IModel, { modelDefaults, modelSchema } from "./IModel"
import { ExtractProps } from "./utils/extractProps"

export default interface IDummy extends IModel {
    preset: "default" | "rifle"
    strideForward: number
    strideRight: number
}

export const dummySchema: Required<ExtractProps<IDummy>> = {
    ...modelSchema,
    preset: String,
    strideForward: Number,
    strideRight: Number
}

export const dummyDefaults: IDummy = {
    ...modelDefaults,
    preset: "default",
    strideForward: 0,
    strideRight: 0
}
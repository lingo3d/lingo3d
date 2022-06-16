import IModel, { modelDefaults, modelSchema } from "./IModel"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IDummy extends IModel {
    spineName: Nullable<string>
    preset: "default" | "rifle"
    strideForward: number
    strideRight: number
    strideMove: boolean
}

export const dummySchema: Required<ExtractProps<IDummy>> = {
    ...modelSchema,
    spineName: String,
    preset: String,
    strideForward: Number,
    strideRight: Number,
    strideMove: Boolean
}

export const dummyDefaults: IDummy = {
    ...modelDefaults,
    spineName: undefined,
    preset: "default",
    strideForward: 0,
    strideRight: 0,
    strideMove: false
}
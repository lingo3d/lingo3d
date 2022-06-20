import IModel, { modelDefaults, modelSchema } from "./IModel"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export type StrideMode = "aim" | "free"

export default interface IDummy extends IModel {
    spineName: Nullable<string>
    preset: "default" | "rifle"
    strideForward: number
    strideRight: number
    strideMove: boolean
    strideMode: StrideMode
}

export const dummySchema: Required<ExtractProps<IDummy>> = {
    ...modelSchema,
    spineName: String,
    preset: String,
    strideForward: Number,
    strideRight: Number,
    strideMove: Boolean,
    strideMode: String
}

export const dummyDefaults: Defaults<IDummy> = {
    ...modelDefaults,
    spineName: undefined,
    preset: "default",
    strideForward: 0,
    strideRight: 0,
    strideMove: false,
    strideMode: "aim"
}
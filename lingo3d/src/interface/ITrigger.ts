import IPositioned, { positionedDefaults, positionedSchema } from "./IPositioned"
import { ExtractProps } from "./utils/extractProps"
import fn from "./utils/fn"
import Nullable from "./utils/Nullable"

export default interface ITrigger extends IPositioned {
    onEnter: Nullable<() => void>
    onExit: Nullable<() => void>
    targetIds: Nullable<string | Array<string>>
    pad: boolean
    radius: number
    interval: number
    helper: boolean
}

export const triggerSchema: Required<ExtractProps<ITrigger>> = {
    ...positionedSchema,
    onEnter: Function,
    onExit: Function,
    targetIds: [String, Array],
    pad: Boolean,
    radius: Number,
    interval: Number,
    helper: Boolean
}

export const triggerDefaults: ITrigger ={
    ...positionedDefaults,
    onEnter: undefined,
    onExit: undefined,
    targetIds: undefined,
    pad: false,
    radius: 50,
    interval: 300,
    helper: true
}

export const triggerRequiredDefaults: ITrigger ={
    ...triggerDefaults,
    onEnter: fn,
    onExit: fn,
    targetIds: ""
}
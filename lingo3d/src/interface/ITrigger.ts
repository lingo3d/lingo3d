import IPositioned, { positionedDefaults, positionedSchema } from "./IPositioned"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
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

export const triggerDefaults: Defaults<ITrigger> ={
    ...positionedDefaults,
    onEnter: undefined,
    onExit: undefined,
    targetIds: undefined,
    pad: false,
    radius: 50,
    interval: 300,
    helper: true
}
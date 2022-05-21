import IPositioned, { positionedDefaults, positionedSchema } from "./IPositioned"
import { ExtractProps } from "./utils/extractProps"

export default interface ITrigger extends IPositioned {
    onEnter: (() => void) | undefined
    onExit: (() => void) | undefined
    targetIds?: string | Array<string>
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
    pad: false,
    radius: 50,
    interval: 300,
    helper: true
}
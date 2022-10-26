import IPositioned, {
    positionedDefaults,
    positionedSchema
} from "./IPositioned"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import MeshItem from "../display/core/MeshItem"

export default interface ITrigger extends IPositioned {
    onEnter: Nullable<(target: MeshItem) => void>
    onExit: Nullable<() => void>
    target: Nullable<string | Array<string> | MeshItem>
    pad: boolean
    radius: number
    interval: number
    helper: boolean
}

export const triggerSchema: Required<ExtractProps<ITrigger>> = {
    ...positionedSchema,
    onEnter: Function,
    onExit: Function,
    target: [String, Array, Object],
    pad: Boolean,
    radius: Number,
    interval: Number,
    helper: Boolean
}

export const triggerDefaults = extendDefaults<ITrigger>(
    [positionedDefaults],
    {
        onEnter: undefined,
        onExit: undefined,
        target: undefined,
        pad: false,
        radius: 50,
        interval: 300,
        helper: true
    },

    {
        radius: new Range(0, 1000),
        interval: new Range(100, 1000, 100)
    }
)

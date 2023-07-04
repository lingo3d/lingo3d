import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import Nullable from "./utils/Nullable"
import Range from "./utils/Range"

export default interface IMeshAppendable extends IAppendable {
    x: number
    y: number
    z: number

    rotationX: number
    rotationY: number
    rotationZ: number

    onMove: Nullable<() => void>
    onMoveToEnd: Nullable<() => void>
    onLookToEnd: Nullable<() => void>
}

export const meshAppendableSchema: Required<ExtractProps<IMeshAppendable>> = {
    ...appendableSchema,
    x: Number,
    y: Number,
    z: Number,

    rotationX: Number,
    rotationY: Number,
    rotationZ: Number,

    onMove: Function,
    onMoveToEnd: Function,
    onLookToEnd: Function
}

export const meshAppendableDefaults = extendDefaults<IMeshAppendable>(
    [appendableDefaults],
    {
        x: 0,
        y: 0,
        z: 0,

        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,

        onMove: undefined,
        onMoveToEnd: undefined,
        onLookToEnd: undefined
    },
    {
        rotationX: new Range(0, 360),
        rotationY: new Range(0, 360),
        rotationZ: new Range(0, 360)
    }
)

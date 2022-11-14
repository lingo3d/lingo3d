import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"

export default interface IPositioned extends IAppendable {
    x: number
    y: number
    z: number
    onMove: Nullable<() => void>
}

export const positionedSchema: Required<ExtractProps<IPositioned>> = {
    ...appendableSchema,
    x: Number,
    y: Number,
    z: Number,
    onMove: Function
}

export const positionedDefaults = extendDefaults<IPositioned>(
    [appendableDefaults],
    { x: 0, y: 0, z: 0, onMove: undefined }
)

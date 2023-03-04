import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IProjectionNode extends IAppendable {
    x: number
    y: number
    distance: number
    outX: number
    outY: number
    outZ: number
}

export const projectionNodeSchema: Required<ExtractProps<IProjectionNode>> = {
    ...appendableSchema,
    x: Number,
    y: Number,
    distance: Number,
    outX: Number,
    outY: Number,
    outZ: Number
}

export const projectionNodeDefaults = extendDefaults<IProjectionNode>(
    [appendableDefaults],
    {
        x: 0,
        y: 0,
        distance: 500,
        outX: 0,
        outY: 0,
        outZ: 0
    }
)

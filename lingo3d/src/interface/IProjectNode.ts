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
    outputX: number
    outputY: number
    outputZ: number
}

export const projectionNodeSchema: Required<ExtractProps<IProjectionNode>> = {
    ...appendableSchema,
    x: Number,
    y: Number,
    distance: Number,
    outputX: Number,
    outputY: Number,
    outputZ: Number
}

export const projectionNodeDefaults = extendDefaults<IProjectionNode>(
    [appendableDefaults],
    {
        x: 0,
        y: 0,
        distance: 500,
        outputX: 0,
        outputY: 0,
        outputZ: 0
    }
)

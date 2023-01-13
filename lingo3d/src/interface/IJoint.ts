import MeshManager from "../display/core/MeshManager"
import IPositioned, {
    positionedDefaults,
    positionedSchema
} from "./IPositioned"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import Range from "./utils/Range"

export default interface IJoint extends IPositioned {
    from: Nullable<string | MeshManager>
    to: Nullable<string | MeshManager>
    xLimitAngle: number
    yLimitAngle: number
}

export const jointSchema: Required<ExtractProps<IJoint>> = {
    ...positionedSchema,
    from: [String, Object],
    to: [String, Object],
    xLimitAngle: Number,
    yLimitAngle: Number
}

export const jointDefaults = extendDefaults<IJoint>(
    [positionedDefaults],
    {
        from: undefined,
        to: undefined,
        xLimitAngle: 360,
        yLimitAngle: 360
    },
    {
        xLimitAngle: new Range(0, 360),
        yLimitAngle: new Range(0, 360)
    }
)

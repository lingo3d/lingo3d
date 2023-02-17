import { Point3d } from "@lincode/math"
import { pt3d0 } from "../display/utils/reusables"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IPoint3dNode extends IAppendable {
    x: number
    y: number
    z: number
    position: Point3d
}

export const point3dNodeSchema: Required<ExtractProps<IPoint3dNode>> = {
    ...appendableSchema,
    x: Number,
    y: Number,
    z: Number,
    position: Object
}

export const point3dNodeDefaults = extendDefaults<IPoint3dNode>(
    [appendableDefaults],
    {
        x: 0,
        y: 0,
        z: 0,
        position: pt3d0
    }
)

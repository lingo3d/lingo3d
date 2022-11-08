import { Point3d } from "@lincode/math"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Range from "./utils/Range"

export default interface ICurve extends IEventLoop {
    points: Array<Point3d>
    helper: boolean
    subdivide: number
}

export const curveSchema: Required<ExtractProps<ICurve>> = {
    ...eventLoopSchema,
    points: Array,
    helper: Boolean,
    subdivide: Number
}
hideSchema(["points"])

export const curveDefaults = extendDefaults<ICurve>(
    [eventLoopDefaults],
    {
        points: [],
        helper: false,
        subdivide: 3
    },
    {
        subdivide: new Range(1, 10, 1)
    }
)

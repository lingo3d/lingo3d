import { Point3d } from "@lincode/math"
import IGroup, { groupDefaults, groupSchema } from "./IGroup"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Range from "./utils/Range"

export default interface ICurve extends IGroup {
    points: Array<Point3d>
    helper: boolean
    subdivide: number
}

export const curveSchema: Required<ExtractProps<ICurve>> = {
    ...groupSchema,
    points: Array,
    helper: Boolean,
    subdivide: Number
}
hideSchema(["points"])

export const curveDefaults = extendDefaults<ICurve>(
    [groupDefaults],
    {
        points: [],
        helper: false,
        subdivide: 1
    },
    {
        subdivide: new Range(1, 10, 1)
    }
)

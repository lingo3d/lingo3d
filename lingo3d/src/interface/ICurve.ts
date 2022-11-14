import { Point3d } from "@lincode/math"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Range from "./utils/Range"

export default interface ICurve extends IAppendable {
    points: Array<Point3d>
    helper: boolean
    subdivide: number
}

export const curveSchema: Required<ExtractProps<ICurve>> = {
    ...appendableSchema,
    points: Array,
    helper: Boolean,
    subdivide: Number
}
hideSchema(["points"])

export const curveDefaults = extendDefaults<ICurve>(
    [appendableDefaults],
    {
        points: [],
        helper: false,
        subdivide: 3
    },
    {
        subdivide: new Range(1, 10, 1)
    }
)

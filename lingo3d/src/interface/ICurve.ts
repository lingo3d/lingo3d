import { Point3d } from "@lincode/math"
import IMeshAppendable, {
    meshAppendableDefaults,
    meshAppendableSchema
} from "./IMeshAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import Range from "./utils/Range"

export default interface ICurve extends IMeshAppendable {
    points: Array<Point3d>
    helper: boolean
    subdivide: number
}

export const curveSchema: Required<ExtractProps<ICurve>> = {
    ...meshAppendableSchema,
    points: Array,
    helper: Boolean,
    subdivide: Number
}
hideSchema(["points"])

export const curveDefaults = extendDefaults<ICurve>(
    [meshAppendableDefaults],
    {
        points: [],
        helper: false,
        subdivide: 3
    },
    {
        subdivide: new Range(1, 10, 1)
    }
)

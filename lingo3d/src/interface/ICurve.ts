import { Point3d } from "@lincode/math"
import IGroup, { groupDefaults, groupSchema } from "./IGroup"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"

export default interface ICurve extends IGroup {
    points: Array<Point3d>
    helper: boolean
}

export const curveSchema: Required<ExtractProps<ICurve>> = {
    ...groupSchema,
    points: Array,
    helper: Boolean
}
hideSchema(["points"])

export const curveDefaults = extendDefaults<ICurve>([groupDefaults], {
    points: [],
    helper: false
})

import { Point3d } from "@lincode/math"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"

export default interface ICurve extends IEventLoop {
    points: Array<Point3d>
    helper: boolean
}

export const curveSchema: Required<ExtractProps<ICurve>> = {
    ...eventLoopSchema,
    points: Array,
    helper: Boolean
}
hideSchema(["points"])

export const curveDefaults = extendDefaults<ICurve>([eventLoopDefaults], {
    points: [],
    helper: false
})

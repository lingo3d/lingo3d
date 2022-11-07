import { Point3d } from "@lincode/math"
import ISimpleObjectManager, {
    simpleObjectManagerDefaults,
    simpleObjectManagerSchema
} from "./ISimpleObjectManager"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"

export default interface ICurve extends ISimpleObjectManager {
    points: Array<Point3d>
    helper: boolean
}

export const curveSchema: Required<ExtractProps<ICurve>> = {
    ...simpleObjectManagerSchema,
    points: Array,
    helper: Boolean
}
hideSchema(["points"])

export const curveDefaults = extendDefaults<ICurve>(
    [simpleObjectManagerDefaults],
    {
        points: [],
        helper: false
    }
)

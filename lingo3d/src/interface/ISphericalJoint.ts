import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"
import Range from "./utils/Range"

export default interface ISphericalJoint extends IJointBase {
    yLimitAngle: Nullable<number>
    zLimitAngle: Nullable<number>
}

export const sphericalJointSchema: Required<ExtractProps<ISphericalJoint>> = {
    ...jointBaseSchema,
    yLimitAngle: Number,
    zLimitAngle: Number
}

export const sphericalJointDefaults = extendDefaults<ISphericalJoint>(
    [jointBaseDefaults],
    {
        yLimitAngle: new NullableDefault(360),
        zLimitAngle: new NullableDefault(360)
    },
    {
        yLimitAngle: new Range(0, 360),
        zLimitAngle: new Range(0, 360)
    }
)

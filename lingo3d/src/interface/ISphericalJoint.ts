import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"
import Range from "./utils/Range"

export default interface ISphericalJoint extends IJointBase {
    limitY: Nullable<number>
    limitZ: Nullable<number>
}

export const sphericalJointSchema: Required<ExtractProps<ISphericalJoint>> = {
    ...jointBaseSchema,
    limitY: Number,
    limitZ: Number
}

export const sphericalJointDefaults = extendDefaults<ISphericalJoint>(
    [jointBaseDefaults],
    {
        limitY: new NullableDefault(360),
        limitZ: new NullableDefault(360)
    },
    {
        limitY: new Range(0, 360),
        limitZ: new Range(0, 360)
    }
)

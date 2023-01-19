import { coneLimitRange } from "./ID6Joint"
import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISphericalJoint extends IJointBase {
    limited: boolean
    limitY: number
    limitZ: number
}

export const sphericalJointSchema: Required<ExtractProps<ISphericalJoint>> = {
    ...jointBaseSchema,
    limited: Boolean,
    limitY: Number,
    limitZ: Number
}

export const sphericalJointDefaults = extendDefaults<ISphericalJoint>(
    [jointBaseDefaults],
    {
        limited: false,
        limitY: 360,
        limitZ: 360
    },
    {
        limitY: coneLimitRange,
        limitZ: coneLimitRange
    }
)

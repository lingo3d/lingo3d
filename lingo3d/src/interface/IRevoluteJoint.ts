import { angularLimitRange, dampingRange, stiffnessRange } from "./ID6Joint"
import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IRevoluteJoint extends IJointBase {
    limited: boolean
    limitLow: number
    limitHigh: number
    stiffness: number
    damping: number
}

export const revoluteJointSchema: Required<ExtractProps<IRevoluteJoint>> = {
    ...jointBaseSchema,
    limited: Boolean,
    limitLow: Number,
    limitHigh: Number,
    stiffness: Number,
    damping: Number
}

export const revoluteJointDefaults = extendDefaults<IRevoluteJoint>(
    [jointBaseDefaults],
    {
        limited: false,
        limitLow: -360,
        limitHigh: 360,
        stiffness: 0,
        damping: 0
    },
    {
        limitLow: angularLimitRange,
        limitHigh: angularLimitRange,
        stiffness: stiffnessRange,
        damping: dampingRange
    }
)

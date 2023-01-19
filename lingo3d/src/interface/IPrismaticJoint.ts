import { dampingRange, limitRange, stiffnessRange } from "./ID6Joint"
import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IPrismaticJoint extends IJointBase {
    limited: boolean
    limitLow: number
    limitHigh: number
    stiffness: number
    damping: number
}

export const prismaticJointSchema: Required<ExtractProps<IPrismaticJoint>> = {
    ...jointBaseSchema,
    limited: Boolean,
    limitLow: Number,
    limitHigh: Number,
    stiffness: Number,
    damping: Number
}

export const prismaticJointDefaults = extendDefaults<IPrismaticJoint>(
    [jointBaseDefaults],
    {
        limited: false,
        limitLow: -100,
        limitHigh: 100,
        stiffness: 0,
        damping: 0
    },
    {
        limitLow: limitRange,
        limitHigh: limitRange,
        stiffness: stiffnessRange,
        damping: dampingRange
    }
)

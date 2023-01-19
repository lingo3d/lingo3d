import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export default interface IPrismaticJoint extends IJointBase {
    limitLow: number
    limitHigh: number
    stiffness: number
    damping: number
}

export const prismaticJointSchema: Required<ExtractProps<IPrismaticJoint>> = {
    ...jointBaseSchema,
    limitLow: Number,
    limitHigh: Number,
    stiffness: Number,
    damping: Number
}

export const prismaticJointDefaults = extendDefaults<IPrismaticJoint>(
    [jointBaseDefaults],
    {
        limitLow: -100,
        limitHigh: 100,
        stiffness: 0,
        damping: 0
    },
    {
        limitLow: new Range(-200, 200),
        limitHigh: new Range(-200, 200),
        stiffness: new Range(0, 500),
        damping: new Range(0, 100)
    }
)

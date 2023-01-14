import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export default interface ISphericalJoint extends IJointBase {
    yLimitAngle: number
    zLimitAngle: number
}

export const sphericalJointSchema: Required<ExtractProps<ISphericalJoint>> = {
    ...jointBaseSchema,
    yLimitAngle: Number,
    zLimitAngle: Number
}

export const sphericalJointDefaults = extendDefaults<ISphericalJoint>(
    [jointBaseDefaults],
    {
        yLimitAngle: 360,
        zLimitAngle: 360
    },
    {
        yLimitAngle: new Range(0, 360),
        zLimitAngle: new Range(0, 360)
    }
)

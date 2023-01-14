import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IDistanceJoint extends IJointBase {}

export const distanceJointSchema: Required<ExtractProps<IDistanceJoint>> = {
    ...jointBaseSchema
}

export const distanceJointDefaults = extendDefaults<IDistanceJoint>(
    [jointBaseDefaults],
    {}
)

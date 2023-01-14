import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IFixedJoint extends IJointBase {}

export const fixedJointSchema: Required<ExtractProps<IFixedJoint>> = {
    ...jointBaseSchema
}

export const fixedJointDefaults = extendDefaults<IFixedJoint>(
    [jointBaseDefaults],
    {}
)

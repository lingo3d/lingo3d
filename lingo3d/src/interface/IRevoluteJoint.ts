import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IRevoluteJoint extends IJointBase {}

export const revoluteJointSchema: Required<ExtractProps<IRevoluteJoint>> = {
    ...jointBaseSchema
}

export const revoluteJointDefaults = extendDefaults<IRevoluteJoint>(
    [jointBaseDefaults],
    {}
)

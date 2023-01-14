import IJointBase, { jointBaseDefaults, jointBaseSchema } from "./IJointBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IPrismaticJoint extends IJointBase {}

export const prismaticJointSchema: Required<ExtractProps<IPrismaticJoint>> = {
    ...jointBaseSchema
}

export const prismaticJointDefaults = extendDefaults<IPrismaticJoint>(
    [jointBaseDefaults],
    {}
)

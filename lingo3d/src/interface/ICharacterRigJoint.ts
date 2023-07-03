import IPrimitive, { primitiveDefaults, primitiveSchema } from "./IPrimitive"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ICharacterRigJoint extends IPrimitive {}

export const characterRigJointSchema: Required<
    ExtractProps<ICharacterRigJoint>
> = {
    ...primitiveSchema
}

export const characterRigJointDefaults = extendDefaults<ICharacterRigJoint>(
    [primitiveDefaults],
    {}
)

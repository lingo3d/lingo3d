import IGimbalObjectManager, {
    gimbalObjectManagerDefaults,
    gimbalObjectManagerSchema
} from "./IGimbalObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface ICharacterRigJoint extends IGimbalObjectManager {}

export const characterRigJointSchema: Required<
    ExtractProps<ICharacterRigJoint>
> = {
    ...gimbalObjectManagerSchema
}

export const characterRigJointDefaults = extendDefaults<ICharacterRigJoint>(
    [gimbalObjectManagerDefaults],
    {}
)

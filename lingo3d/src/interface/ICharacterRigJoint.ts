import IGimbalObjectManager, {
    gimbalObjectManagerDefaults,
    gimbalObjectManagerSchema
} from "./IGimbalObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import { CharacterRigJointName } from "./ICharacterRig"

export default interface ICharacterRigJoint extends IGimbalObjectManager {
    target: CharacterRigJointName | undefined
}

export const characterRigJointSchema: Required<
    ExtractProps<ICharacterRigJoint>
> = {
    ...gimbalObjectManagerSchema,
    target: String
}

export const characterRigJointDefaults = extendDefaults<ICharacterRigJoint>(
    [gimbalObjectManagerDefaults],
    { target: undefined }
)

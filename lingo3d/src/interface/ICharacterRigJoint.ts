import ISimpleObjectManager, {
    simpleObjectManagerDefaults,
    simpleObjectManagerSchema
} from "./ISimpleObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import { CharacterRigJointName } from "./ICharacterRig"

export default interface ICharacterRigJoint extends ISimpleObjectManager {
    target: CharacterRigJointName | undefined
}

export const characterRigJointSchema: Required<
    ExtractProps<ICharacterRigJoint>
> = {
    ...simpleObjectManagerSchema,
    target: String
}

export const characterRigJointDefaults = extendDefaults<ICharacterRigJoint>(
    [simpleObjectManagerDefaults],
    { target: undefined }
)

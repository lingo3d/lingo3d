import { uuidMap } from "../../collections/idCollections"
import CharacterRig from "../../display/CharacterRig"
import Model from "../../display/Model"
import { parseCharacter } from "../../memo/parseCharacter"
import { characterRigAnimationSystem } from "../characterRigAnimationSystem"
import createInternalSystem from "../utils/createInternalSystem"

export const configCharacterRigAnimationSystem = createInternalSystem(
    "configCharacterRigAnimationSystem",
    {
        data: {} as { target: Model },
        update: (self: CharacterRig, data) => {
            if (!data.target.$loadedObject) return
            if (!self.target || !self.jointMap.size) return

            const model = uuidMap.get(self.target)
            if (!(model instanceof Model) || !model.$loadedObject) return

            configCharacterRigAnimationSystem.delete(self)

            const characterMap = parseCharacter(data.target.$loadedObject!)
            const { jointMap } = self

            characterRigAnimationSystem.add(self, {
                leftHandSrc: characterMap.get("leftHand")!,
                leftForeArmSrc: characterMap.get("leftForeArm")!,
                leftArmSrc: characterMap.get("leftArm")!,
                leftShoulderSrc: characterMap.get("leftShoulder")!,

                leftHandDst: jointMap.get("leftHand"),
                leftForeArmDst: jointMap.get("leftForeArm"),
                leftArmDst: jointMap.get("leftArm"),
                leftShoulderDst: jointMap.get("leftShoulder"),

                rightHandSrc: characterMap.get("rightHand")!,
                rightForeArmSrc: characterMap.get("rightForeArm")!,
                rightArmSrc: characterMap.get("rightArm")!,
                rightShoulderSrc: characterMap.get("rightShoulder")!,

                rightHandDst: jointMap.get("rightHand"),
                rightForeArmDst: jointMap.get("rightForeArm"),
                rightArmDst: jointMap.get("rightArm"),
                rightShoulderDst: jointMap.get("rightShoulder")
            })
        }
    }
)

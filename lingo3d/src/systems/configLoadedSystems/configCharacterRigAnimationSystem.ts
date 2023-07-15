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
                rightShoulderDst: jointMap.get("rightShoulder"),

                leftForeFootSrc: characterMap.get("leftForeFoot")!,
                leftFootSrc: characterMap.get("leftFoot")!,
                leftLegSrc: characterMap.get("leftLeg")!,
                leftThighSrc: characterMap.get("leftThigh")!,
                leftForeFootDst: jointMap.get("leftForeFoot"),
                leftFootDst: jointMap.get("leftFoot"),
                leftLegDst: jointMap.get("leftLeg"),
                leftThighDst: jointMap.get("leftThigh"),

                rightForeFootSrc: characterMap.get("rightForeFoot")!,
                rightFootSrc: characterMap.get("rightFoot")!,
                rightLegSrc: characterMap.get("rightLeg")!,
                rightThighSrc: characterMap.get("rightThigh")!,
                rightForeFootDst: jointMap.get("rightForeFoot"),
                rightFootDst: jointMap.get("rightFoot"),
                rightLegDst: jointMap.get("rightLeg"),
                rightThighDst: jointMap.get("rightThigh"),

                neckSrc: characterMap.get("neck")!,
                spine2Src: characterMap.get("spine2")!,
                spine1Src: characterMap.get("spine1")!,
                spine0Src: characterMap.get("spine0")!,
                hipsSrc: characterMap.get("hips")!,
                neckDst: jointMap.get("neck"),
                spine2Dst: jointMap.get("spine2"),
                spine1Dst: jointMap.get("spine1"),
                spine0Dst: jointMap.get("spine0"),
                hipsDst: jointMap.get("hips")
            })
        }
    }
)

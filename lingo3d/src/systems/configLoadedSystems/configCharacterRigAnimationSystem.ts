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

            const hipsSrc = characterMap.get("hips")!
            const hipsDst = jointMap.get("hips")

            characterRigAnimationSystem.add(self, {
                leftHand: [
                    characterMap.get("leftHand"),
                    jointMap.get("leftHand")
                ],
                leftForeArm: [
                    characterMap.get("leftForeArm"),
                    jointMap.get("leftForeArm")
                ],
                leftArm: [characterMap.get("leftArm"), jointMap.get("leftArm")],
                leftShoulder: [
                    characterMap.get("leftShoulder"),
                    jointMap.get("leftShoulder")
                ],

                rightHand: [
                    characterMap.get("rightHand"),
                    jointMap.get("rightHand")
                ],
                rightForeArm: [
                    characterMap.get("rightForeArm"),
                    jointMap.get("rightForeArm")
                ],
                rightArm: [
                    characterMap.get("rightArm"),
                    jointMap.get("rightArm")
                ],
                rightShoulder: [
                    characterMap.get("rightShoulder"),
                    jointMap.get("rightShoulder")
                ],

                leftForeFoot: [
                    characterMap.get("leftForeFoot"),
                    jointMap.get("leftForeFoot")
                ],
                leftFoot: [
                    characterMap.get("leftFoot"),
                    jointMap.get("leftFoot")
                ],
                leftLeg: [characterMap.get("leftLeg"), jointMap.get("leftLeg")],
                leftThigh: [
                    characterMap.get("leftThigh"),
                    jointMap.get("leftThigh")
                ],

                rightForeFoot: [
                    characterMap.get("rightForeFoot"),
                    jointMap.get("rightForeFoot")
                ],
                rightFoot: [
                    characterMap.get("rightFoot"),
                    jointMap.get("rightFoot")
                ],
                rightLeg: [
                    characterMap.get("rightLeg"),
                    jointMap.get("rightLeg")
                ],
                rightThigh: [
                    characterMap.get("rightThigh"),
                    jointMap.get("rightThigh")
                ],

                head: [characterMap.get("head"), jointMap.get("head")],
                neck: [characterMap.get("neck"), jointMap.get("neck")],
                spine2: [characterMap.get("spine2"), jointMap.get("spine2")],
                spine1: [characterMap.get("spine1"), jointMap.get("spine1")],
                spine0: [characterMap.get("spine0"), jointMap.get("spine0")],
                hips: [characterMap.get("hips"), jointMap.get("hips")],

                hipsPositionSrc: hipsSrc.position.clone(),
                hipsPositionDst: hipsDst?.position.clone()
            })
        }
    }
)

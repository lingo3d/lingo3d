import { uuidMap } from "../../collections/idCollections"
import CharacterRig from "../../display/CharacterRig"
import Model from "../../display/Model"
import FoundManager from "../../display/core/FoundManager"
import { CharacterRigJointName } from "../../interface/ICharacterRig"
import { parseCharacter } from "../../memo/parseCharacter"
import createInternalSystem from "../utils/createInternalSystem"

const setJoint = (
    self: CharacterRig,
    characterMap: Map<CharacterRigJointName, FoundManager>,
    name: CharacterRigJointName,
    scorePtr: [number]
) => {
    if ((self[name] = characterMap.get(name)?.uuid)) ++scorePtr[0]
}

export const appendToCharacterRigSystem = createInternalSystem(
    "appendToCharacterRigSystem",
    {
        update: (self: CharacterRig) => {
            const model = uuidMap.get(self.target!)
            if (!(model instanceof Model)) {
                appendToCharacterRigSystem.delete(self)
                return
            }
            if (!model.$loadedObject) return
            appendToCharacterRigSystem.delete(self)

            const characterMap = parseCharacter(model.$loadedObject)
            const leftPtr: [number] = [0]
            const rightPtr: [number] = [0]
            const spinePtr: [number] = [0]

            setJoint(self, characterMap, "hips", spinePtr)
            setJoint(self, characterMap, "spine0", spinePtr)
            setJoint(self, characterMap, "spine1", spinePtr)
            setJoint(self, characterMap, "spine2", spinePtr)
            setJoint(self, characterMap, "neck", spinePtr)
            setJoint(self, characterMap, "head", spinePtr)

            setJoint(self, characterMap, "leftShoulder", leftPtr)
            setJoint(self, characterMap, "leftArm", leftPtr)
            setJoint(self, characterMap, "leftForeArm", leftPtr)
            setJoint(self, characterMap, "leftHand", leftPtr)

            setJoint(self, characterMap, "rightShoulder", rightPtr)
            setJoint(self, characterMap, "rightArm", rightPtr)
            setJoint(self, characterMap, "rightForeArm", rightPtr)
            setJoint(self, characterMap, "rightHand", rightPtr)

            setJoint(self, characterMap, "leftThigh", leftPtr)
            setJoint(self, characterMap, "leftLeg", leftPtr)
            setJoint(self, characterMap, "leftFoot", leftPtr)
            setJoint(self, characterMap, "leftForeFoot", leftPtr)

            setJoint(self, characterMap, "rightThigh", rightPtr)
            setJoint(self, characterMap, "rightLeg", rightPtr)
            setJoint(self, characterMap, "rightFoot", rightPtr)
            setJoint(self, characterMap, "rightForeFoot", rightPtr)

            if (
                leftPtr[0] === rightPtr[0] &&
                leftPtr[0] >= 6 &&
                spinePtr[0] >= 4
            )
                self.enabled = true
        }
    }
)

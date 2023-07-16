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
            const scorePtr: [number] = [0]

            setJoint(self, characterMap, "hips", scorePtr)
            setJoint(self, characterMap, "spine0", scorePtr)
            setJoint(self, characterMap, "spine1", scorePtr)
            setJoint(self, characterMap, "spine2", scorePtr)
            setJoint(self, characterMap, "neck", scorePtr)
            setJoint(self, characterMap, "head", scorePtr)

            setJoint(self, characterMap, "leftShoulder", scorePtr)
            setJoint(self, characterMap, "leftArm", scorePtr)
            setJoint(self, characterMap, "leftForeArm", scorePtr)
            setJoint(self, characterMap, "leftHand", scorePtr)

            setJoint(self, characterMap, "rightShoulder", scorePtr)
            setJoint(self, characterMap, "rightArm", scorePtr)
            setJoint(self, characterMap, "rightForeArm", scorePtr)
            setJoint(self, characterMap, "rightHand", scorePtr)

            setJoint(self, characterMap, "leftThigh", scorePtr)
            setJoint(self, characterMap, "leftLeg", scorePtr)
            setJoint(self, characterMap, "leftFoot", scorePtr)
            setJoint(self, characterMap, "leftForeFoot", scorePtr)

            setJoint(self, characterMap, "rightThigh", scorePtr)
            setJoint(self, characterMap, "rightLeg", scorePtr)
            setJoint(self, characterMap, "rightFoot", scorePtr)
            setJoint(self, characterMap, "rightForeFoot", scorePtr)

            if (scorePtr[0] === 22) self.enabled = true
        }
    }
)

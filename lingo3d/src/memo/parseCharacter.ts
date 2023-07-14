import computeOnce from "./utils/computeOnce"
import Model from "../display/Model"
import { CharacterRigJointName } from "../interface/ICharacterRig"
import FoundManager from "../display/core/FoundManager"

const makePredicate = (regEx: RegExp) => (name: string) => regEx.test(name)
const findLeftHand = makePredicate(/left.*hand/i)
const findRightHand = makePredicate(/right.*hand/i)

export const parseCharacter = computeOnce((target: Model) => {
    const map = new Map<CharacterRigJointName, FoundManager>()
    const found = target.findFirst(findLeftHand)
    // if (found)
})

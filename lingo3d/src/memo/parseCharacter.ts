import computeOnce from "./utils/computeOnce"
import Model from "../display/Model"
import { CharacterRigJointName } from "../interface/ICharacterRig"
import FoundManager from "../display/core/FoundManager"

const makePredicate = (regEx: RegExp) => (name: string) => regEx.test(name)

const testLeftHand = makePredicate(/left.*hand/i)
const testLeftForeArm = makePredicate(/left.*(fore|up).*arm/i)
const testLeftArm = makePredicate(/left.*arm/i)
const testLeftShoulder = makePredicate(/left.*shoulder/i)

export const parseCharacter = computeOnce((target: Model) => {
    const map = new Map<CharacterRigJointName, FoundManager>()

    // const leftHandTests = new Map<CharacterRigJointName, typeof testLeftHand>([["leftHand"]])
    // let found = target.findFirst(leftHandTests[0])
    // while (found) {
    // }
})

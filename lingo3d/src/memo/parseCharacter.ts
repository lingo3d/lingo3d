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

    const leftHandTests = new Map<CharacterRigJointName, typeof testLeftHand>([
        ["leftHand", testLeftHand],
        ["leftForeArm", testLeftForeArm],
        ["leftArm", testLeftArm],
        ["leftShoulder", testLeftShoulder]
    ])
    let found: FoundManager | undefined
    let first = true
    while (true) {
        if (first) {
            first = false
            const [[name, test]] = leftHandTests
            found = target.findFirst(test)
            if (!found) break
            map.set(name, found)
            leftHandTests.delete(name)
            if (!leftHandTests.size) break
            continue
        }
        found = found?.parentNode
        if (!found) break
        for (const [name, test] of leftHandTests) {
            if (!test(found.name!)) continue
            map.set(name, found)
            leftHandTests.delete(name)
            if (!leftHandTests.size) break
            break
        }
    }

    console.log(map)
})

import computeOnce from "./utils/computeOnce"
import Model from "../display/Model"
import { CharacterRigJointName } from "../interface/ICharacterRig"
import FoundManager from "../display/core/FoundManager"

const makePredicate = (regEx: RegExp) => (name: string) => regEx.test(name)

const testLeftHand = makePredicate(/left.*hand/i)
const testLeftForeArm = makePredicate(/left.*(fore|up).*arm/i)
const testLeftArm = makePredicate(/left.*arm/i)
const testLeftShoulder = makePredicate(/left.*shoulder/i)

const testRightHand = makePredicate(/right.*hand/i)
const testRightForeArm = makePredicate(/right.*(fore|up).*arm/i)
const testRightArm = makePredicate(/right.*arm/i)
const testRightShoulder = makePredicate(/right.*shoulder/i)

const parseChain = (
    map: Map<CharacterRigJointName, FoundManager>,
    target: Model,
    chain: Array<[CharacterRigJointName, typeof testLeftHand]>
) => {
    const tests = new Map(chain)
    const [[name, test]] = tests
    let found = target.findFirst(test)
    if (!found) return
    map.set(name, found)
    tests.delete(name)
    if (!tests.size) return
    while (true) {
        found = found?.parentNode
        if (!found) break
        for (const [name, test] of tests) {
            if (!test(found.name!)) continue
            map.set(name, found)
            tests.delete(name)
            if (!tests.size) break
        }
    }
}

export const parseCharacter = computeOnce((target: Model) => {
    const map = new Map<CharacterRigJointName, FoundManager>()
    parseChain(map, target, [
        ["leftHand", testLeftHand],
        ["leftForeArm", testLeftForeArm],
        ["leftArm", testLeftArm],
        ["leftShoulder", testLeftShoulder]
    ])
    parseChain(map, target, [
        ["rightHand", testRightHand],
        ["rightForeArm", testRightForeArm],
        ["rightArm", testRightArm],
        ["rightShoulder", testRightShoulder]
    ])
    return map
})

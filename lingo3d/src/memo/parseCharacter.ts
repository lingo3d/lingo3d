import computeOnce from "./utils/computeOnce"
import Model from "../display/Model"
import { CharacterRigJointName } from "../interface/ICharacterRig"
import FoundManager from "../display/core/FoundManager"
import { indexChildrenNames } from "./indexChildrenNames"
import { getFoundManager } from "../display/core/utils/getFoundManager"
import { Object3D } from "three"

const makePredicate = (regEx: RegExp) => (name: string) => regEx.test(name)

const testLeftHand = makePredicate(/left.*hand/i)
const testLeftForeArm = makePredicate(/left.*(fore|up).*arm/i)
const testLeftArm = makePredicate(/left.*arm/i)
const testLeftShoulder = makePredicate(/left.*shoulder/i)

const testRightHand = makePredicate(/right.*hand/i)
const testRightForeArm = makePredicate(/right.*(fore|up).*arm/i)
const testRightArm = makePredicate(/right.*arm/i)
const testRightShoulder = makePredicate(/right.*shoulder/i)

const take = (
    pool: Map<string, Object3D>,
    map: Map<CharacterRigJointName, FoundManager>,
    model: Model,
    name: CharacterRigJointName,
    test: (name: string) => boolean
) => {
    for (const [n, obj] of pool) {
        if (!test(n)) continue
        map.set(name, getFoundManager(obj, model))
        pool.delete(n)
        break
    }
}

export const parseCharacter = computeOnce((model: Model) => {
    const map = new Map<CharacterRigJointName, FoundManager>()
    if (!model.$loadedObject) return map

    const pool = new Map(indexChildrenNames(model.$loadedObject))
    take(pool, map, model, "leftHand", testLeftHand)
    take(pool, map, model, "leftForeArm", testLeftForeArm)
    take(pool, map, model, "leftArm", testLeftArm)
    take(pool, map, model, "leftShoulder", testLeftShoulder)

    return map
})

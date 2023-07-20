import computeOnce from "./utils/computeOnce"
import Model from "../display/Model"
import { CharacterRigJointName } from "../interface/ICharacterRig"
import FoundManager from "../display/core/FoundManager"
import { indexChildrenNames } from "./indexChildrenNames"
import { getFoundManager } from "../display/core/utils/getFoundManager"
import { Bone, Object3D } from "three"
import { getManager } from "../display/core/utils/getManager"

const makePredicate = (regEx: RegExp) => (name: string) => regEx.test(name)

const testLeftHand = makePredicate(/l.*hand$/i)
const testLeftForeArm = makePredicate(/l.*fore.*arm$/i)
const testLeftShoulder = makePredicate(/l.*(collar$|(sh.*l.*d.*r$))/i)
const testLeftArm = makePredicate(/l.*(arm$|(sh.*l.*d.*r$))/i)

const testRightHand = makePredicate(/r.*hand$/i)
const testRightForeArm = makePredicate(/r.*fore.*arm$/i)
const testRightShoulder = makePredicate(/r.*(collar$|(sh.*l.*d.*r$))/i)
const testRightArm = makePredicate(/r.*(arm$|(sh.*l.*d.*r$))/i)

const testLeftForeFoot = makePredicate(/l.*((fore.*foot$)|toe)/i)
const testLeftFoot = makePredicate(/l.*foot$/i)
const testLeftThigh = makePredicate(/l.*((up*leg$)|thigh$)/i)
const testLeftLeg = makePredicate(/l.*(leg$|shin$)/i)

const testRightForeFoot = makePredicate(/r.*((fore.*foot$)|toe)/i)
const testRightFoot = makePredicate(/r.*foot$/i)
const testRightThigh = makePredicate(/r.*((up*leg$)|thigh$)/i)
const testRightLeg = makePredicate(/r.*(leg$|shin$)/i)

const testSpine2 = makePredicate(/(spine.*2$)|chest$/i)
const testSpine1 = makePredicate(/spine.*1$/i)
const testSpine0 = makePredicate(/(spine.*0$)|spine$|abdomen$/i)
const testNeck = makePredicate(/neck$/i)
const testHead = makePredicate(/head$/i)
const testHips = makePredicate(/hip$|hips$|pelvis$|root$/i)

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

export const parseCharacter = computeOnce((loadedObject: Object3D) => {
    const map = new Map<CharacterRigJointName, FoundManager>()
    const model = getManager(loadedObject)
    if (!(model instanceof Model)) return map

    const pool = new Map(indexChildrenNames(loadedObject))
    for (const [name, child] of pool)
        !(child instanceof Bone) && pool.delete(name)

    take(pool, map, model, "leftHand", testLeftHand)
    take(pool, map, model, "leftForeArm", testLeftForeArm)
    take(pool, map, model, "leftShoulder", testLeftShoulder)
    take(pool, map, model, "leftArm", testLeftArm)

    take(pool, map, model, "rightHand", testRightHand)
    take(pool, map, model, "rightForeArm", testRightForeArm)
    take(pool, map, model, "rightShoulder", testRightShoulder)
    take(pool, map, model, "rightArm", testRightArm)

    take(pool, map, model, "leftForeFoot", testLeftForeFoot)
    take(pool, map, model, "leftFoot", testLeftFoot)
    take(pool, map, model, "leftThigh", testLeftThigh)
    take(pool, map, model, "leftLeg", testLeftLeg)

    take(pool, map, model, "rightForeFoot", testRightForeFoot)
    take(pool, map, model, "rightFoot", testRightFoot)
    take(pool, map, model, "rightThigh", testRightThigh)
    take(pool, map, model, "rightLeg", testRightLeg)

    take(pool, map, model, "spine2", testSpine2)
    take(pool, map, model, "spine1", testSpine1)
    take(pool, map, model, "spine0", testSpine0)
    take(pool, map, model, "neck", testNeck)
    take(pool, map, model, "head", testHead)
    take(pool, map, model, "hips", testHips)

    return map
})

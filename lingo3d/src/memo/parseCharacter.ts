import computeOnce from "./utils/computeOnce"
import Model from "../display/Model"

const makePredicate = (regEx: RegExp) => (name: string) => regEx.test(name)
const findLeftHand = makePredicate(/left.*hand/i)
const findRightHand = makePredicate(/right.*hand/i)

export const parseCharacter = computeOnce((target: Model) => {
    const found = target.findFirst(findLeftHand)
    console.log(found?.$object.parent)
})

import { Object3D } from "three"
import computeOnce from "./utils/computeOnce"
import { indexChildrenNames } from "./indexChildrenNames"

export const parseCharacter = computeOnce((target: Object3D) => {
    indexChildrenNames(target)
})

import { Object3D } from "three"
import getWorldPosition from "./getWorldPosition"
import { box3, vector3 } from "./reusables"
import computeClonePerFrame from "../../utils/computeClonePerFrame"

export default computeClonePerFrame((target: Object3D) => {
    if ("isBone" in target) return getWorldPosition(target)
    target.updateWorldMatrix(true, false)
    box3.setFromObject(target)
    if (box3.isEmpty()) return getWorldPosition(target)
    return box3.getCenter(vector3)
})

import { Object3D, Vector3 } from "three"
import computePerFrame from "../../utils/computePerFrame"
import getWorldPosition from "./getWorldPosition"
import { box3 } from "./reusables"

export default computePerFrame((target: Object3D) => {
    if ("isBone" in target) return getWorldPosition(target)
    target.updateWorldMatrix(true, false)
    box3.setFromObject(target)
    if (box3.isEmpty()) return getWorldPosition(target)
    return box3.getCenter(new Vector3())
})

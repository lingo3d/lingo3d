import { Object3D } from "three"
import { vector3 } from "./reusables"
import computeClonePerFrame from "../../utils/computeClonePerFrame"

export default computeClonePerFrame(
    (target: { object3d: Object3D; outerObject3d: Object3D }) =>
        vector3.copy(target.object3d.scale).multiply(target.outerObject3d.scale)
)

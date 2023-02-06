import { Object3D } from "three"
import computePerFrame from "../../utils/computePerFrame"
import { vector3 } from "./reusables"

export default computePerFrame(
    (target: { object3d: Object3D; outerObject3d: Object3D }) =>
        vector3.copy(target.object3d.scale).multiply(target.outerObject3d.scale)
)

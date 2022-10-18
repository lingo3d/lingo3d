import { Object3D } from "three"
import scene from "../../engine/scene"
import computePerFrame from "../../utils/computePerFrame"
import { quaternion } from "./reusables"

export default computePerFrame((target: Object3D) =>
    target.parent === scene
        ? target.quaternion
        : target.getWorldQuaternion(quaternion)
)

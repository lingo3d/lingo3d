import { Object3D, Quaternion } from "three"
import scene from "../../engine/scene"
import computePerFrame from "../../utils/computePerFrame"

export default computePerFrame((target: Object3D) =>
    target.parent === scene
        ? target.quaternion.clone()
        : target.getWorldQuaternion(new Quaternion())
)

import { Object3D } from "three"
import scene from "../engine/scene"
import { quaternion } from "../display/utils/reusables"
import computeClonePerFrame from "./utils/computeClonePerFrame"

export default computeClonePerFrame((target: Object3D) =>
    target.parent === scene
        ? target.quaternion
        : target.getWorldQuaternion(quaternion)
)

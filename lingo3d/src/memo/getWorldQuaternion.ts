import { Object3D } from "three"
import scene from "../engine/scene"
import { quaternion } from "../display/utils/reusables"
import computeClonePerFrame from "./utils/computeClonePerFrame"
import getParent from "../display/core/utils/getParent"

export default computeClonePerFrame((target: Object3D) =>
    getParent(target) === scene
        ? target.quaternion
        : target.getWorldQuaternion(quaternion)
)

import { Object3D, Quaternion } from "three"
import scene from "../../engine/scene"

export default (target: Object3D) =>
    target.parent === scene
        ? target.quaternion.clone()
        : target.getWorldQuaternion(new Quaternion())

import { Object3D, Vector3 } from "three"
import scene from "../../engine/scene"

export default (target: Object3D) =>
    target.parent === scene
        ? target.position.clone()
        : target.getWorldPosition(new Vector3())

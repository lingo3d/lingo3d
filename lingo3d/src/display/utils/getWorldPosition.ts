import { Object3D, Vector3 } from "three"
import scene from "../../engine/scene"
import computePerFrame from "../../utils/computePerFrame"

export default computePerFrame((target: Object3D) =>
    target.parent === scene
        ? target.position.clone()
        : target.getWorldPosition(new Vector3())
)

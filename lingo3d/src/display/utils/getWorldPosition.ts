import { Object3D, Vector3 } from "three"
import scene from "../../engine/scene"
import computePerFrame from "../../utils/computePerFrame"
import { vector3 } from "./reusables"

export default computePerFrame((target: Object3D) =>
    target.parent === scene ? target.position : target.getWorldPosition(vector3)
)

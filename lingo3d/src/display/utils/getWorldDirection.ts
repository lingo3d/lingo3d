import { Object3D, Vector3 } from "three"
import computePerFrame from "../../utils/computePerFrame"
import { vector3 } from "./reusables"

export default computePerFrame((target: Object3D) =>
    target.getWorldDirection(vector3)
)

import { Object3D } from "three"
import { vector3 } from "./reusables"
import computeClonePerFrame from "../../utils/computeClonePerFrame"

export default computeClonePerFrame((target: Object3D) =>
    target.getWorldDirection(vector3)
)

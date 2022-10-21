import { Object3D, Vector3 } from "three"
import computePerFrame from "../../utils/computePerFrame"

export default computePerFrame((target: Object3D) =>
    target.getWorldDirection(new Vector3())
)

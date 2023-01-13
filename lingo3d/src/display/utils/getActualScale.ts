import MeshAppendable from "../../api/core/MeshAppendable"
import computePerFrame from "../../utils/computePerFrame"
import { vector3 } from "./reusables"

export default computePerFrame((target: MeshAppendable) =>
    vector3.copy(target.object3d.scale).multiply(target.outerObject3d.scale)
)

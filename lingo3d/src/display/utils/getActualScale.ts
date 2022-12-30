import computePerFrame from "../../utils/computePerFrame"
import MeshManager from "../core/MeshManager"
import { vector3 } from "./reusables"

export default computePerFrame((target: MeshManager) =>
    vector3.copy(target.object3d.scale).multiply(target.outerObject3d.scale)
)

import computePerFrame from "../../utils/computePerFrame"
import MeshItem from "../core/MeshItem"
import { vector3 } from "./reusables"

export default computePerFrame((target: MeshItem) =>
    vector3.copy(target.object3d.scale).multiply(target.outerObject3d.scale)
)

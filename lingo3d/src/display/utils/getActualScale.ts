import computePerFrame from "../../utils/computePerFrame"
import MeshItem from "../core/MeshItem"

export default computePerFrame((target: MeshItem) =>
    target.nativeObject3d.scale.clone().multiply(target.outerObject3d.scale)
)

import { vector3 } from "../display/utils/reusables"
import computeClonePerFrame from "./utils/computeClonePerFrame"
import MeshAppendable from "../display/core/MeshAppendable"

export default computeClonePerFrame((target: MeshAppendable) =>
    vector3.copy(target.$innerObject.scale).multiply(target.$object.scale)
)

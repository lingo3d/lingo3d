import MeshAppendable from "../../api/core/MeshAppendable"
import configSystem from "../utils/configSystem"

export const [addTransformChangedSystem] = configSystem(
    (target: MeshAppendable) => {}
)

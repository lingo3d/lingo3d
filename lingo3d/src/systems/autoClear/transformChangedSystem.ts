import MeshAppendable from "../../api/core/MeshAppendable"
import renderSystemAutoClear from "../utils/renderSystemAutoClear"

export const [addTransformChangedSystem] = renderSystemAutoClear(
    (target: MeshAppendable) => {}
)

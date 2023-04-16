import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"

export const disableSceneGraph = new WeakSet<Appendable | MeshAppendable>()

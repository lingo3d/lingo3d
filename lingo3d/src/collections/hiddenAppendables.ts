import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"

export const hiddenAppendables = new WeakSet<Appendable | MeshAppendable>()

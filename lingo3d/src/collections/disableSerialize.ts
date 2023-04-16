import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"

export const disableSerialize = new WeakSet<Appendable | MeshAppendable>()

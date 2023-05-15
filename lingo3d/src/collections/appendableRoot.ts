import Appendable from "../display/core/Appendable"
import MeshAppendable from "../display/core/MeshAppendable"

export const appendableRoot = new Set<Appendable | MeshAppendable>()

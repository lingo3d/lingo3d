import Appendable from "./Appendable"
import MeshAppendable from "./MeshAppendable"

export const appendableRoot = new Set<Appendable | MeshAppendable>()
export const hiddenAppendables = new WeakSet<Appendable | MeshAppendable>()
export const nonSerializedAppendables = new WeakSet<
    Appendable | MeshAppendable
>()
export const uuidMap = new Map<string, Appendable | MeshAppendable>()

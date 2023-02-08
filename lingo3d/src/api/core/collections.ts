import { deleteSpatialBinSystem } from "../../display/core/VisibleObjectManager/spatialBinSystem"
import Appendable from "./Appendable"
import MeshAppendable from "./MeshAppendable"

export const appendableRoot = new Set<Appendable | MeshAppendable>()
export const hiddenAppendables = new WeakSet<Appendable | MeshAppendable>()
export const nonSerializedAppendables = new WeakSet<
    Appendable | MeshAppendable
>()
export const uuidMap = new Map<string, Appendable | MeshAppendable>()

export const eraseAppendable = (appendable: Appendable | MeshAppendable) => {
    hiddenAppendables.add(appendable)
    nonSerializedAppendables.add(appendable)
    "object3d" in appendable && deleteSpatialBinSystem(appendable)
}

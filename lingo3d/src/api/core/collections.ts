import { hiddenAppendables } from "../../collections/hiddenAppendables"
import JointBase from "../../display/core/JointBase"
import Appendable from "./Appendable"
import MeshAppendable from "./MeshAppendable"

export const nonSerializedAppendables = new WeakSet<
    Appendable | MeshAppendable
>()
export const uuidMap = new Map<string, Appendable | MeshAppendable>()
export const joints = new Set<JointBase>()
export const reflectionVisibleSet = new Set<MeshAppendable>()

export const eraseAppendable = (appendable: Appendable | MeshAppendable) => {
    hiddenAppendables.add(appendable)
    nonSerializedAppendables.add(appendable)
}

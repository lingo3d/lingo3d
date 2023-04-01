import { hiddenAppendables } from "../../collections/hiddenAppendables"
import { nonSerializedAppendables } from "../../collections/nonSerializedAppendables"
import JointBase from "../../display/core/JointBase"
import Appendable from "./Appendable"
import MeshAppendable from "./MeshAppendable"

export const joints = new Set<JointBase>()
export const reflectionVisibleSet = new Set<MeshAppendable>()

export const eraseAppendable = (appendable: Appendable | MeshAppendable) => {
    hiddenAppendables.add(appendable)
    nonSerializedAppendables.add(appendable)
}

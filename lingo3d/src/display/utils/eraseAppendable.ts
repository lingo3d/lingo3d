import Appendable from "../../api/core/Appendable"
import MeshAppendable from "../../api/core/MeshAppendable"
import { hiddenAppendables } from "../../collections/hiddenAppendables"
import { nonSerializedAppendables } from "../../collections/nonSerializedAppendables"

export const eraseAppendable = (appendable: Appendable | MeshAppendable) => {
    hiddenAppendables.add(appendable)
    nonSerializedAppendables.add(appendable)
}

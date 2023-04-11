import store from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"

export const [setSelectionTarget, getSelectionTarget] = store<
    Appendable | MeshAppendable | undefined
>(undefined)

getSelectionTarget((target) => (selectionTargetPtr[0] = target))

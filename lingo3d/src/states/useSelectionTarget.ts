import store from "@lincode/reactivity"
import Appendable from "../display/core/Appendable"
import MeshAppendable from "../display/core/MeshAppendable"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"

export const [setSelectionTarget, getSelectionTarget] = store<
    Appendable | MeshAppendable | undefined
>(undefined)

getSelectionTarget((target) => (selectionTargetPtr[0] = target))

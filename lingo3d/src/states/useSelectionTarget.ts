import store from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"

export const [setSelectionTarget, getSelectionTarget] = store<
    Appendable | MeshAppendable | undefined
>(undefined)

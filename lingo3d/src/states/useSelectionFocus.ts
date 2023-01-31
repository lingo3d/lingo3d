import store from "@lincode/reactivity"
import MeshAppendable from "../api/core/MeshAppendable"

export const [setSelectionFocus, getSelectionFocus] = store<
    MeshAppendable | undefined
>(undefined)

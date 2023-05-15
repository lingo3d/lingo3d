import store from "@lincode/reactivity"
import MeshAppendable from "../display/core/MeshAppendable"

export const [setSelectionFocus, getSelectionFocus] = store<
    MeshAppendable | undefined
>(undefined)

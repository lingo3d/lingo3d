import store from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"

export const [setSelectionFocus, getSelectionFocus] = store<
    Appendable | undefined
>(undefined)

import store from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"

export const [setSelectionTarget, getSelectionTarget] = store<
    Appendable | undefined
>(undefined)

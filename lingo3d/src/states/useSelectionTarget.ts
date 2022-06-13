import store from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import { getSelectionLocked } from "./useSelectionLocked"

const [_setSelectionTarget, getSelectionTarget] = store<Appendable | undefined>(undefined)
export { getSelectionTarget }

export const setSelectionTarget = (target: Appendable | undefined) => {
    !getSelectionLocked() && _setSelectionTarget(target)
}
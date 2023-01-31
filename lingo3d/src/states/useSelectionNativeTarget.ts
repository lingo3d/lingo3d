import store from "@lincode/reactivity"
import { debounceTrailing } from "@lincode/utils"
import { Object3D } from "three"
import { getSelectionTarget } from "./useSelectionTarget"

const [_setSelectionNativeTarget, getSelectionNativeTarget] = store<
    Object3D | undefined
>(undefined)
export { getSelectionNativeTarget }

//debounce to wait for selectionTarget to be set
export const setSelectionNativeTarget = debounceTrailing(
    _setSelectionNativeTarget,
    1
)

getSelectionTarget(() => _setSelectionNativeTarget(undefined))

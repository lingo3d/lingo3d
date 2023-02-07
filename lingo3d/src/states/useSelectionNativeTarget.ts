import store from "@lincode/reactivity"
import { throttleTrailing } from "@lincode/utils"
import { Object3D } from "three"
import { onSelectionTarget } from "../events/onSelectionTarget"
import { getSelectionTarget } from "./useSelectionTarget"

const [_setSelectionNativeTarget, getSelectionNativeTarget] = store<
    Object3D | undefined
>(undefined)
export { getSelectionNativeTarget }

//debounce to wait for selectionTarget to be set
export const setSelectionNativeTarget = throttleTrailing(
    _setSelectionNativeTarget,
    1
)

onSelectionTarget(() => _setSelectionNativeTarget(undefined))
getSelectionTarget(() => _setSelectionNativeTarget(undefined))

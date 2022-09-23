import store from "@lincode/reactivity"
import { Object3D } from "three"
import { getSelectionTarget } from "./useSelectionTarget"

export const [setSelectionNativeTarget, getSelectionNativeTarget] = store<
    Object3D | undefined
>(undefined)

getSelectionTarget(() => setSelectionNativeTarget(undefined))

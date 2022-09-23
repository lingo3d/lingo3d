import store from "@lincode/reactivity"
import { Object3D } from "three"
import { getSelectionTarget } from "./useSelectionTarget"

export const [setSelectionSubTarget, getSelectionSubTarget] = store<
    Object3D | undefined
>(undefined)

getSelectionTarget(() => setSelectionSubTarget(undefined))

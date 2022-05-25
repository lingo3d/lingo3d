import store from "@lincode/reactivity"
import { Object3D } from "three"
import { getSelectionTarget } from "./useSelectionTarget"

export const [setSceneGraphTarget, getSceneGraphTarget] = store<Object3D | undefined>(undefined)

getSelectionTarget(() => setSceneGraphTarget(undefined))
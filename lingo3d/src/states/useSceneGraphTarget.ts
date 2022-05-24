import store from "@lincode/reactivity"
import { Object3D } from "three"
import Appendable from "../api/core/Appendable"
import { getSelectionTarget } from "./useSelectionTarget"

export const [setSceneGraphTarget, getSceneGraphTarget] = store<Appendable | Object3D | undefined>(undefined)

getSelectionTarget(() => setSceneGraphTarget(undefined))
import store from "@lincode/reactivity"
import { Object3D } from "three"

export const [setSceneGraphExpanded, getSceneGraphExpanded] = store<
    Set<Object3D> | undefined
>(undefined)

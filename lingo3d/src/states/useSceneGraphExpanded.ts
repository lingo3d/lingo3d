import store from "@lincode/reactivity"
import { Object3D } from "three"

export const [setSceneGraphExpanded, getSceneGraphExpanded] = store<
    Set<Object3D> | undefined
>(undefined)

const traverseUp = (obj: Object3D, expandedSet: Set<Object3D>) => {
    expandedSet.add(obj)
    const { parent } = obj
    parent && traverseUp(parent, expandedSet)
}

export const sceneGraphExpand = (found: Object3D) => {
    const expandedSet = new Set<Object3D>()
    traverseUp(found, expandedSet)
    setSceneGraphExpanded(expandedSet)
}

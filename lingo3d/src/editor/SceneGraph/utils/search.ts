import { Object3D } from "three"
import Appendable from "../../../api/core/Appendable"
import MeshAppendable from "../../../api/core/MeshAppendable"
import Loaded from "../../../display/core/Loaded"
import { setSceneGraphExpanded } from "../../../states/useSceneGraphExpanded"
import { setSelectionNativeTarget } from "../../../states/useSelectionNativeTarget"

const traverseUp = (obj: Object3D, expandedSet: Set<Object3D>) => {
    expandedSet.add(obj)
    const { parent } = obj
    parent && traverseUp(parent, expandedSet)
}

export default (n: string, target: Loaded | Appendable | MeshAppendable) => {
    const name = n.toLowerCase()
    let found: Object3D | undefined
    if (target instanceof Loaded)
        target.loadedGroup.traverse((item) => {
            if (found || !item.name.toLowerCase().includes(name)) return
            found = item
        })
    else if ("outerObject3d" in target)
        target.outerObject3d.traverse((item) => {
            if (found || !item.name.toLowerCase().includes(name)) return
            found = item
        })
    if (!found) return

    const expandedSet = new Set<Object3D>()
    traverseUp(found, expandedSet)
    setSceneGraphExpanded(expandedSet)
    setSelectionNativeTarget(found)
}

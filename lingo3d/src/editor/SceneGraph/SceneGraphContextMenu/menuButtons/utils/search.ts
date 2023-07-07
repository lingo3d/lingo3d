import { sceneGraphExpand } from "../../../../../states/useSceneGraphExpanded"
import Model from "../../../../../display/Model"
import Appendable from "../../../../../display/core/Appendable"
import { emitSelectionTarget } from "../../../../../events/onSelectionTarget"

export default (n: string, target: Appendable) => {
    if (!(target instanceof Model)) return
    const name = n.toLowerCase()
    const found = target.findFirst((childName) =>
        childName.toLowerCase().includes(name)
    )
    if (!found) return
    emitSelectionTarget(found)
    sceneGraphExpand(found.outerObject3d)
}

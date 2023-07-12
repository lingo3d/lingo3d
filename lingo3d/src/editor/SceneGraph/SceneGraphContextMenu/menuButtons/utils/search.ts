import { sceneGraphExpand } from "../../../../../states/useSceneGraphExpanded"
import Model from "../../../../../display/Model"
import Appendable from "../../../../../display/core/Appendable"
import { emitSelectionTarget } from "../../../../../events/onSelectionTarget"

export default (n: string, target: Appendable) => {
    if (!(target instanceof Model)) return
    const found = target.findFirst((name) =>
        name.toLowerCase().includes(n.toLowerCase())
    )
    if (!found) return
    emitSelectionTarget(found)
    sceneGraphExpand(found.$object)
}

import { sceneGraphExpand } from "../../../../../states/useSceneGraphExpanded"
import Model from "../../../../../display/Model"
import Appendable from "../../../../../display/core/Appendable"
import { emitSelectionTarget } from "../../../../../events/onSelectionTarget"
import { getFoundManager } from "../../../../../display/core/utils/getFoundManager"

export default (n: string, target: Appendable) => {
    if (!(target instanceof Model)) return
    const name = n.toLowerCase()
    let found = target.findFirst((childName) =>
        childName.toLowerCase().includes(name)
    )
    if (!found) return
    if (found.$object.parent?.name.toLowerCase().includes(name))
        found = getFoundManager(found.$object.parent, target)
    emitSelectionTarget(found)
    sceneGraphExpand(found.$object)
}

import { sceneGraphExpand } from "../../../states/useSceneGraphExpanded"
import Model from "../../../display/Model"
import { setSelectionTarget } from "../../../states/useSelectionTarget"
import Appendable from "../../../api/core/Appendable"

export default (n: string, target: Appendable) => {
    if (!(target instanceof Model)) return
    const name = n.toLowerCase()
    const found = target.findOne((childName) =>
        childName.toLowerCase().includes(name)
    )
    if (!found) return
    setSelectionTarget(found)
    sceneGraphExpand(found.outerObject3d)
}

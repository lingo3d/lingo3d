import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"
import { multipleSelectionTargets } from "../collections/multipleSelectionTargets"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import throttleFrame from "./utils/throttleFrame"

export default throttleFrame(() => {
    const targets: Array<Appendable | MeshAppendable> = []
    selectionTargetPtr[0] && targets.push(selectionTargetPtr[0])
    for (const target of multipleSelectionTargets) targets.push(target)
    return targets
})

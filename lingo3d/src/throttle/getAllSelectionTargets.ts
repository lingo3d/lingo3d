import Appendable from "../display/core/Appendable"
import MeshAppendable from "../display/core/MeshAppendable"
import { multipleSelectionTargets } from "../collections/multipleSelectionTargets"
import { multipleSelectionGroupPtr } from "../pointers/multipleSelectionGroupPtr"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import throttleFrame from "./utils/throttleFrame"

export default throttleFrame(() => {
    const targets: Array<Appendable | MeshAppendable> = []
    selectionTargetPtr[0] &&
        selectionTargetPtr[0] !== multipleSelectionGroupPtr[0] &&
        targets.push(selectionTargetPtr[0])
    for (const target of multipleSelectionTargets) targets.push(target)
    return targets
})

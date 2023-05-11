import Appendable from "../api/core/Appendable"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import { multipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import computePerFrame from "./utils/computePerFrame"

export default computePerFrame((_: void) => {
    const targets: Array<Appendable> = []
    selectionTargetPtr[0] && targets.push(selectionTargetPtr[0])
    for (const target of multipleSelectionTargets) targets.push(target)
    return targets
})

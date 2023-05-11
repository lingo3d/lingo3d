import Appendable from "../../api/core/Appendable"
import MeshAppendable from "../../api/core/MeshAppendable"
import spawn from "../../api/spawn"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import {
    flushMultipleSelectionTargets,
    multipleSelectionTargets
} from "../../states/useMultipleSelectionTargets"

const copy = <T extends Appendable | MeshAppendable>(target: T) => {
    const item = spawn(target)!
    target.parent?.append(item)
    return item as T
}

export default () => {
    const [target] = selectionTargetPtr
    if (multipleSelectionTargets.size) {
        flushMultipleSelectionTargets((targets) => {
            const newTargets: Array<MeshAppendable> = []
            for (const target of targets) newTargets.push(copy(target))
            return newTargets
        })
    } else if (target) emitSelectionTarget(copy(target))
}

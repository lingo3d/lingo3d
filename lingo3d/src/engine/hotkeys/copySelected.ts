import Appendable from "../../api/core/Appendable"
import MeshAppendable from "../../api/core/MeshAppendable"
import spawn from "../../api/spawn"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import {
    getMultipleSelectionTargets,
    flushMultipleSelectionTargets
} from "../../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../../states/useSelectionTarget"

const copy = <T extends Appendable | MeshAppendable>(target: T) => {
    const item = spawn(target)!
    target.parent?.append(item)
    return item as T
}

export default () => {
    const target = getSelectionTarget()
    const [targets] = getMultipleSelectionTargets()
    if (targets.size) {
        flushMultipleSelectionTargets((targets) => {
            const newTargets: Array<MeshAppendable> = []
            for (const target of targets) newTargets.push(copy(target))
            return newTargets
        })
    } else if (target) emitSelectionTarget(copy(target))
}

import Appendable from "../../api/core/Appendable"
import MeshAppendable from "../../api/core/MeshAppendable"
import deserialize from "../../api/serializer/deserialize"
import serialize from "../../api/serializer/serialize"
import PositionedManager from "../../display/core/PositionedManager"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import {
    getMultipleSelectionTargets,
    flushMultipleSelectionTargets
} from "../../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../../states/useSelectionTarget"

const copy = <T extends Appendable | MeshAppendable>(target: T): T => {
    const [item] = deserialize(serialize(false, target, true))
    if (target.parent && item) {
        "attach" in target.parent
            ? target.parent.attach(item)
            : target.parent.append(item)
    }
    return item as any
}

export default () => {
    const target = getSelectionTarget()
    const [targets] = getMultipleSelectionTargets()
    if (targets.size) {
        flushMultipleSelectionTargets((targets) => {
            const newTargets: Array<PositionedManager> = []
            for (const target of targets) newTargets.push(copy(target))
            return newTargets
        })
    } else if (target) emitSelectionTarget(copy(target))
}

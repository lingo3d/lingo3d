import Appendable from "../../api/core/Appendable"
import MeshAppendable from "../../api/core/MeshAppendable"
import deserialize from "../../api/serializer/deserialize"
import serialize from "../../api/serializer/serialize"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import {
    getMultipleSelectionTargets,
    flushMultipleSelectionTargets
} from "../../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../../states/useSelectionTarget"

const copy = async (target: Appendable | MeshAppendable) => {
    const [item] = deserialize(await serialize(false, target, true))
    if (target.parent && item) {
        "attach" in target.parent
            ? target.parent.attach(item)
            : target.parent.append(item)
        emitSelectionTarget(item)
    }
}

export default () => {
    const target = getSelectionTarget()
    const targets = getMultipleSelectionTargets()
    if (targets.length) {
        flushMultipleSelectionTargets((targets) => {
            for (const target of targets) copy(target)
        })
    } else if (target) copy(target)
}

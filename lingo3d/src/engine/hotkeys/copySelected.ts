import Appendable from "../../api/core/Appendable"
import MeshAppendable from "../../api/core/MeshAppendable"
import { serializeAppendable } from "../../api/serializer/serialize"
import spawn from "../../api/spawn"
import { CommandRecord, pushUndoStack } from "../../api/undoStack"
import { multipleSelectionTargets } from "../../collections/multipleSelectionTargets"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { flushMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"

const copy = <T extends Appendable | MeshAppendable>(target: T) => {
    const item = spawn(target)!
    target.parent?.append(item)
    return item as T
}

export default () => {
    const [target] = selectionTargetPtr
    if (multipleSelectionTargets.size) {
        flushMultipleSelectionTargets((targets) => {
            const commandRecord: CommandRecord = {}
            const newTargets: Array<MeshAppendable> = []
            for (const target of targets) {
                const manager = copy(target)
                newTargets.push(manager)
                commandRecord[manager.uuid] = {
                    command: "create",
                    ...serializeAppendable(manager, false)
                }
            }
            pushUndoStack(commandRecord)
            return newTargets
        })
    } else if (target) {
        const manager = copy(target)
        flushMultipleSelectionTargets(() => {
            pushUndoStack({
                [manager.uuid]: {
                    command: "create",
                    ...serializeAppendable(manager, false)
                }
            })
            emitSelectionTarget(manager)
        }, true)
    }
}

import Appendable from "../../display/core/Appendable"
import MeshAppendable from "../../display/core/MeshAppendable"
import { serializeAppendable } from "../../api/serializer/serialize"
import spawn from "../../api/spawn"
import { CommandRecord, pushUndoStack } from "../../api/undoStack"
import { multipleSelectionTargets } from "../../collections/multipleSelectionTargets"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { flushMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"

const copy = <T extends Appendable | MeshAppendable>(target: T) => {
    const item = spawn(target)
    target.parent?.append(item)
    return item as any as T
}

export default () => {
    if (multipleSelectionTargets.size) {
        flushMultipleSelectionTargets(() => {
            const commandRecord: CommandRecord = {}
            const newTargets: Array<MeshAppendable> = []
            for (const target of multipleSelectionTargets) {
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
        return
    }
    if (!selectionTargetPtr[0]) return
    const manager = copy(selectionTargetPtr[0])
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

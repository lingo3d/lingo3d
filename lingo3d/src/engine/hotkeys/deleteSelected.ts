import { serializeAppendable } from "../../api/serializer/serialize"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { getMultipleSelection } from "../../states/useMultipleSelection"
import { flushMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import { CommandRecord, pushUndoStack } from "../../api/undoStack"

export default () => {
    if (getTransformControlsDragging() || getMultipleSelection()) return

    flushMultipleSelectionTargets((targets) => {
        const commandRecord: CommandRecord = {}
        for (const target of [...targets, selectionTargetPtr[0]]) {
            if (!target) continue
            commandRecord[target.uuid] = {
                command: "delete",
                ...serializeAppendable(target, false)
            }
            target.dispose()
        }
        pushUndoStack(commandRecord)
    }, true)
}

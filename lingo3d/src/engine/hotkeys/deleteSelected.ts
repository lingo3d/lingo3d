import { serializeAppendable } from "../../api/serializer/serialize"
import { getMultipleSelection } from "../../states/useMultipleSelection"
import { flushMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import { CommandRecord, pushUndoStack } from "../../api/undoStack"
import getAllSelectionTargets from "../../throttle/getAllSelectionTargets"

export default () => {
    if (getTransformControlsDragging() || getMultipleSelection()) return

    flushMultipleSelectionTargets(() => {
        const commandRecord: CommandRecord = {}
        for (const target of getAllSelectionTargets()) {
            commandRecord[target.uuid] = {
                command: "delete",
                ...serializeAppendable(target, false)
            }
            target.dispose()
        }
        pushUndoStack(commandRecord)
    }, true)
}

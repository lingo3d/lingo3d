import root from "../../api/root"
import { pushUndoStack } from "../../api/undoStack"
import Appendable from "../../display/core/Appendable"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"

export default (to: Appendable) => {
    const [target] = selectionTargetPtr
    if (!target) return

    pushUndoStack({
        [target.uuid]: {
            command: "move",
            commandFrom: (target.parent ?? root).uuid,
            commandTo: to.uuid
        }
    })
    to.attach(target)
}

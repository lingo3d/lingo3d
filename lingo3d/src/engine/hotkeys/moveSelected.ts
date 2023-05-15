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
            from: (target.parent ?? root).uuid,
            to: to.uuid
        }
    })
    to.attach(target)
}

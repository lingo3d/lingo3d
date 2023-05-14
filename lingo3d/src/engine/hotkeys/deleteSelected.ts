import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { getMultipleSelection } from "../../states/useMultipleSelection"
import { flushMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"

export default () => {
    if (getTransformControlsDragging() || getMultipleSelection()) return

    flushMultipleSelectionTargets((targets) => {
        for (const target of [...targets, selectionTargetPtr[0]]) {
            if (!target) continue
            target.dispose()
        }
    }, true)
}

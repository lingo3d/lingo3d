import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { getMultipleSelection } from "../../states/useMultipleSelection"
import { multipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"

export default () => {
    if (getTransformControlsDragging() || getMultipleSelection()) return

    selectionTargetPtr[0]?.dispose()
    for (const target of multipleSelectionTargets) target.dispose()
}

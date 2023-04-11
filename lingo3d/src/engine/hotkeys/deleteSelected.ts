import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { getMultipleSelection } from "../../states/useMultipleSelection"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"

export default () => {
    if (getTransformControlsDragging() || getMultipleSelection()) return

    const [selectionTarget] = selectionTargetPtr
    const [multipleSelectionTargets] = getMultipleSelectionTargets()

    selectionTarget?.dispose()
    for (const target of multipleSelectionTargets) target.dispose()
}

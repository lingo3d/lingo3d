import { getMultipleSelection } from "../../states/useMultipleSelection"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"

export default () => {
    if (getTransformControlsDragging() || getMultipleSelection()) return

    const selectionTarget = getSelectionTarget()
    const [multipleSelectionTargets] = getMultipleSelectionTargets()

    selectionTarget?.dispose()
    for (const target of multipleSelectionTargets) target.dispose()
}

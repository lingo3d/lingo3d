import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../../states/useSelectionTarget"

export default () => {
    const selectionTarget = getSelectionTarget()
    const multipleSelectionTargets = getMultipleSelectionTargets()

    selectionTarget?.dispose()
    for (const target of multipleSelectionTargets)
        target.dispose()

    emitSelectionTarget(undefined)
}
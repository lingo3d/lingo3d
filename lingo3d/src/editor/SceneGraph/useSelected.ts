import Appendable from "../../display/core/Appendable"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import useSyncState from "../hooks/useSyncState"

export default (manager: Appendable) => {
    const selectionTarget = useSyncState(getSelectionTarget)
    const [multipleSelectionTargets] = useSyncState(getMultipleSelectionTargets)
    return (
        selectionTarget === manager ||
        multipleSelectionTargets.has(manager as any)
    )
}

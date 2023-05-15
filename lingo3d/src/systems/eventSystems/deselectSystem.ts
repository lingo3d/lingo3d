import Appendable from "../../api/core/Appendable"
import { onDispose } from "../../events/onDispose"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { setSelectionTarget } from "../../states/useSelectionTarget"
import eventSimpleSystem from "../utils/eventSimpleSystem"

export const [addDeselectSystem, deleteDeselectSystem] = eventSimpleSystem(
    (self: Appendable, payload) =>
        self === payload &&
        self === selectionTargetPtr[0] &&
        setSelectionTarget(undefined),
    onDispose
)

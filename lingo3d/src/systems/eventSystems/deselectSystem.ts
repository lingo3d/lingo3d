import Appendable from "../../display/core/Appendable"
import { onDispose } from "../../events/onDispose"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { setSelectionTarget } from "../../states/useSelectionTarget"
import createInternalSystem from "../utils/createInternalSystem"

export const deselectSystem = createInternalSystem("deselectSystem", {
    update: (self: Appendable, _, payload) =>
        self === payload &&
        self === selectionTargetPtr[0] &&
        setSelectionTarget(undefined),
    updateTicker: onDispose
})

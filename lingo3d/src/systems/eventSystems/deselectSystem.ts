import Appendable from "../../api/core/Appendable"
import { onDispose } from "../../events/onDispose"
import { setSelectionTarget } from "../../states/useSelectionTarget"
import eventSimpleSystem from "../utils/eventSimpleSystem"

export const [addDeselectSystem, deleteDeselectSystem] = eventSimpleSystem(
    (_: Appendable) => setSelectionTarget(undefined),
    onDispose
)

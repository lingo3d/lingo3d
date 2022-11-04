import { event } from "@lincode/events"
import { debounceTrailing } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import { onSelectionTargetDisposed } from "../states/useSelectionTarget"

type Event = {
    target?: Appendable
    rightClick?: boolean
}
const [_emitSelectionTarget, onSelectionTarget] = event<Event>()
export { onSelectionTarget }

export const emitSelectionTarget = debounceTrailing(
    (target?: Appendable, rightClick?: boolean) =>
        _emitSelectionTarget({ target, rightClick })
)

onSelectionTargetDisposed(emitSelectionTarget)

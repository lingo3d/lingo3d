import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import { debounceTrailing } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { onDispose } from "./onDispose"

type Event = {
    target?: Appendable
    rightClick?: boolean
}
const [_emitSelectionTarget, onSelectionTarget] = event<Event>()
export { onSelectionTarget }

export const emitSelectionTarget = debounceTrailing(
    (target?: Appendable, rightClick?: boolean) =>
        _emitSelectionTarget({ target, rightClick }),
    1
)

createEffect(() => {
    const target = getSelectionTarget()
    if (!target) return

    const handle = onDispose((item) => item === target && emitSelectionTarget())
    return () => {
        handle.cancel()
    }
}, [getSelectionTarget])

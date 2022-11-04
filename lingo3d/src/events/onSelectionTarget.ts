import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import { debounceTrailing } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { onSceneGraphChange } from "./onSceneGraphChange"

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

createEffect(() => {
    const target = getSelectionTarget()
    if (!target) return

    const handle = onSceneGraphChange(() => {
        target.done && emitSelectionTarget()
    })
    return () => {
        handle.cancel()
    }
}, [getSelectionTarget])

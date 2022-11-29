import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import { debounceTrailing } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import {
    getSelectionTarget,
    setSelectionTarget
} from "../states/useSelectionTarget"
import { onDispose } from "./onDispose"

type Event = {
    target?: Appendable
    rightClick?: boolean
    noDeselect?: boolean
}
const [_emitSelectionTarget, onSelectionTarget] = event<Event>()
export { onSelectionTarget }

export const emitSelectionTarget = debounceTrailing(
    (
        target: Appendable | undefined,
        rightClick?: boolean,
        noDeselect?: boolean
    ) => _emitSelectionTarget({ target, rightClick, noDeselect })
)

createEffect(() => {
    const target = getSelectionTarget()
    if (!target) return

    const handle = onDispose(
        (item) => item === target && setSelectionTarget(undefined)
    )
    return () => {
        handle.cancel()
    }
}, [getSelectionTarget])

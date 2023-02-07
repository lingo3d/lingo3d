import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import { throttleTrailing } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"
import {
    getSelectionTarget,
    setSelectionTarget
} from "../states/useSelectionTarget"
import { onDispose } from "./onDispose"

type Event = {
    target?: Appendable | MeshAppendable
    noDeselect?: boolean
}
const [_emitSelectionTarget, onSelectionTarget] = event<Event>()
export { onSelectionTarget }

export const emitSelectionTarget = throttleTrailing(
    (target: Appendable | undefined, noDeselect?: boolean) =>
        _emitSelectionTarget({ target, noDeselect }),
    1
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

import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"
import {
    getSelectionTarget,
    setSelectionTarget
} from "../states/useSelectionTarget"
import { onDispose } from "./onDispose"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import { selectionRedirectMap } from "../collections/selectionRedirectMap"
import throttleFrameTrailing from "../throttle/utils/throttleFrameTrailing"

type Event = {
    target?: Appendable | MeshAppendable
    noDeselect?: boolean
}
const [_emitSelectionTarget, onSelectionTarget] = event<Event>()
export { onSelectionTarget }

export const emitSelectionTarget = throttleFrameTrailing(
    (target: Appendable | MeshAppendable | undefined, noDeselect?: boolean) =>
        _emitSelectionTarget({
            target: (target && selectionRedirectMap.get(target)) ?? target,
            noDeselect
        })
)

createEffect(() => {
    const [target] = selectionTargetPtr
    if (!target) return

    const handle = onDispose(
        (item) => item === target && setSelectionTarget(undefined)
    )
    return () => {
        handle.cancel()
    }
}, [getSelectionTarget])

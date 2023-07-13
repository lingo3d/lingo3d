import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import Appendable from "../display/core/Appendable"
import MeshAppendable from "../display/core/MeshAppendable"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import { selectionRedirectMap } from "../collections/selectionRedirectMap"
import throttleFrameTrailingWithArgs from "../throttle/utils/throttleFrameTrailingWithArgs"
import { deselectSystem } from "../systems/eventSystems/deselectSystem"

type Event = {
    target?: Appendable | MeshAppendable
    noDeselect?: boolean
}
const [_emitSelectionTarget, onSelectionTarget] = event<Event>()
export { onSelectionTarget }

export const emitSelectionTarget = throttleFrameTrailingWithArgs(
    (target: Appendable | MeshAppendable | undefined, noDeselect?: boolean) =>
        _emitSelectionTarget({
            target: (target && selectionRedirectMap.get(target)) ?? target,
            noDeselect
        })
)

createEffect(() => {
    const [target] = selectionTargetPtr
    if (!target) return
    deselectSystem.add(target)
    return () => {
        deselectSystem.delete(target)
    }
}, [getSelectionTarget])

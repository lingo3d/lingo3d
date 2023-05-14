import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"
import {
    getSelectionTarget,
    setSelectionTarget
} from "../states/useSelectionTarget"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import { selectionRedirectMap } from "../collections/selectionRedirectMap"
import throttleFrameTrailing from "../throttle/utils/throttleFrameTrailing"
import {
    addClearStateSystem,
    deleteClearStateSystem
} from "../systems/eventSystems/clearStateSystem"

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
    addClearStateSystem(target, { setState: setSelectionTarget })
    return () => {
        deleteClearStateSystem(target)
    }
}, [getSelectionTarget])

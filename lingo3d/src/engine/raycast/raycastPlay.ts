import { createEffect } from "@lincode/reactivity"
import { clearMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { setSelectionTarget } from "../../states/useSelectionTarget"
import attachRaycastEvent from "./attachRaycastEvent"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import {
    clickSet,
    mouseDownSet,
    mouseUpSet,
    mouseOverSet,
    mouseOutSet,
    mouseMoveSet
} from "../../collections/mouseSets"
import { onMouseClick } from "../../events/onMouseClick"
import { onMouseDown } from "../../events/onMouseDown"
import { onMouseUp } from "../../events/onMouseUp"
import { onMouseMove } from "../../events/onMouseMove"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { getWorldPlay } from "../../states/useWorldPlay"
import { worldPlayPtr } from "../../pointers/worldPlayPtr"

createEffect(() => {
    if (worldPlayPtr[0] !== "live") return

    const [selectionTargetBackup] = selectionTargetPtr

    clearMultipleSelectionTargets()
    setSelectionTarget(undefined)

    const handle0 = attachRaycastEvent(onMouseClick, clickSet, (obj, e) =>
        obj.onClick?.(e)
    )
    const handle1 = attachRaycastEvent(onMouseDown, mouseDownSet, (obj, e) =>
        obj.onMouseDown?.(e)
    )
    const handle2 = attachRaycastEvent(onMouseUp, mouseUpSet, (obj, e) =>
        obj.onMouseUp?.(e)
    )

    let moveSet = new Set<VisibleMixin>()
    let moveSetOld = new Set<VisibleMixin>()

    const handle3 = attachRaycastEvent(onMouseMove, mouseOverSet, (obj, e) => {
        moveSet.add(obj)
        obj.userData.eMove = e
    })
    const handle4 = attachRaycastEvent(onMouseMove, mouseOutSet, (obj, e) => {
        moveSet.add(obj)
        obj.userData.eMove = e
    })
    const handle5 = attachRaycastEvent(onMouseMove, mouseMoveSet, (obj, e) => {
        moveSet.add(obj)
        obj.userData.eMove = e
    })
    const handle6 = onMouseMove(() => {
        for (const obj of moveSet) {
            if (!moveSetOld.has(obj)) obj.onMouseOver?.(obj.userData.eMove)

            obj.onMouseMove?.(obj.userData.eMove)
        }
        for (const obj of moveSetOld)
            if (!moveSet.has(obj)) obj.onMouseOut?.(obj.userData.eMove)

        moveSetOld = moveSet
        moveSet = new Set()
    })

    return () => {
        handle0.cancel()
        handle1.cancel()
        handle2.cancel()
        handle3.cancel()
        handle4.cancel()
        handle5.cancel()
        handle6.cancel()
        !selectionTargetPtr[0] && setSelectionTarget(selectionTargetBackup)
    }
}, [getWorldPlay])

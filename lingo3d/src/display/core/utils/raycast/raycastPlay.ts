import { createEffect } from "@lincode/reactivity"
import { getWorldPlayComputed } from "../../../../states/useWorldPlayComputed"
import { clearMultipleSelectionTargets } from "../../../../states/useMultipleSelectionTargets"
import {
    getSelectionTarget,
    setSelectionTarget
} from "../../../../states/useSelectionTarget"
import pickable from "./pickable"
import VisibleMixin from "../../mixins/VisibleMixin"
import {
    clickSet,
    mouseDownSet,
    mouseUpSet,
    mouseOverSet,
    mouseOutSet,
    mouseMoveSet
} from "../../../../collections/mouseSets"
import { onMouseClick } from "../../../../events/onMouseClick"
import { onMouseDown } from "../../../../events/onMouseDown"
import { onMouseUp } from "../../../../events/onMouseUp"
import { onMouseMove } from "../../../../events/onMouseMove"

createEffect(() => {
    if (!getWorldPlayComputed()) return

    const selectionTargetBackup = getSelectionTarget()

    clearMultipleSelectionTargets()
    setSelectionTarget(undefined)

    const handle0 = pickable(onMouseClick, clickSet, (obj, e) =>
        obj.onClick?.(e)
    )
    const handle1 = pickable(onMouseDown, mouseDownSet, (obj, e) =>
        obj.onMouseDown?.(e)
    )
    const handle2 = pickable(onMouseUp, mouseUpSet, (obj, e) =>
        obj.onMouseUp?.(e)
    )

    let moveSet = new Set<VisibleMixin>()
    let moveSetOld = new Set<VisibleMixin>()

    const handle3 = pickable(onMouseMove, mouseOverSet, (obj, e) => {
        moveSet.add(obj)
        obj.userData.eMove = e
    })
    const handle4 = pickable(onMouseMove, mouseOutSet, (obj, e) => {
        moveSet.add(obj)
        obj.userData.eMove = e
    })
    const handle5 = pickable(onMouseMove, mouseMoveSet, (obj, e) => {
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
        !getSelectionTarget() && setSelectionTarget(selectionTargetBackup)
    }
}, [getWorldPlayComputed])

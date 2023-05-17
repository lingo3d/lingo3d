import { createEffect } from "@lincode/reactivity"
import { getEditorModeComputed } from "../../states/useEditorModeComputed"
import { clearMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { setSelectionTarget } from "../../states/useSelectionTarget"
import { onMouseClick } from "../../events/onMouseClick"
import {
    getSelectionFocus,
    setSelectionFocus
} from "../../states/useSelectionFocus"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import Curve from "../../display/Curve"

createEffect(() => {
    if (getEditorModeComputed() !== "curve") return

    clearMultipleSelectionTargets()
    setSelectionTarget(undefined)

    const curve = new Curve()
    curve.helper = true

    const prevSelectionFocus = getSelectionFocus()
    setSelectionFocus(curve)

    const handle = onMouseClick((e) => {
        const [selected] = selectionTargetPtr
        //todo: setTimeout alternative?
        setTimeout(() => {
            if (handle.done || selectionTargetPtr[0] || selected) return
            curve.addPoint(e.point)
        }, 10)
    })
    return () => {
        curve.helper = false
        curve.points.length < 2 && curve.dispose()
        setSelectionFocus(prevSelectionFocus)
        handle.cancel()
    }
}, [getEditorModeComputed])

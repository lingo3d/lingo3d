import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { getEditorModeComputed } from "../../../../states/useEditorModeComputed"
import { clearMultipleSelectionTargets } from "../../../../states/useMultipleSelectionTargets"
import { setSelectionTarget } from "../../../../states/useSelectionTarget"
import { onMouseClick } from "../../../../events/onMouseClick"
import {
    getSelectionFocus,
    setSelectionFocus
} from "../../../../states/useSelectionFocus"
import { selectionTargetPtr } from "../../../../pointers/selectionTargetPtr"

createEffect(() => {
    if (getEditorModeComputed() !== "curve") return

    clearMultipleSelectionTargets()
    setSelectionTarget(undefined)

    const handle = new Cancellable()
    import("../../../Curve").then(({ default: Curve }) => {
        if (handle.done) return

        const curve = new Curve()
        curve.helper = true
        const prevSelectionFocus = getSelectionFocus()
        setSelectionFocus(curve)

        const handle1 = onMouseClick((e) => {
            const [selected] = selectionTargetPtr
            setTimeout(() => {
                if (handle.done || selectionTargetPtr[0] || selected) return
                curve.addPoint(e.point)
            }, 10)
        })
        handle.then(() => {
            curve.helper = false
            curve.points.length < 2 && curve.dispose()
            handle1.cancel()
            setSelectionFocus(prevSelectionFocus)
        })
    })
    return () => {
        handle.cancel()
    }
}, [getEditorModeComputed])

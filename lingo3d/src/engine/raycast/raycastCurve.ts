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
import { onAfterRender } from "../../events/onAfterRender"
import { onBeforeRender } from "../../events/onBeforeRender"

createEffect(() => {
    if (getEditorModeComputed() !== "curve") return

    clearMultipleSelectionTargets()
    setSelectionTarget(undefined)

    const curve = new Curve()
    curve.helper = true

    const prevSelectionFocus = getSelectionFocus()
    setSelectionFocus(curve)

    const handle = onMouseClick((e) => {
        onAfterRender(
            () =>
                onBeforeRender(
                    () =>
                        !handle.done &&
                        !selectionTargetPtr[0] &&
                        curve.addPoint(e.point),
                    true
                ),
            true
        )
    })
    return () => {
        curve.helper = false
        curve.points.length < 2 && curve.dispose()
        setSelectionFocus(prevSelectionFocus)
        handle.cancel()
    }
}, [getEditorModeComputed])

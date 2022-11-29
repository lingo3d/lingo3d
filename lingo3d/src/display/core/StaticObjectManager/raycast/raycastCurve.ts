import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { mouseEvents } from "../../../../api/mouse"
import { onSelectionTarget } from "../../../../events/onSelectionTarget"
import { getEditorCurve } from "../../../../states/useEditorCurve"
import { setEditorMode } from "../../../../states/useEditorMode"
import {
    getMultipleSelectionTargets,
    resetMultipleSelectionTargets
} from "../../../../states/useMultipleSelectionTargets"
import {
    getSelectionTarget,
    setSelectionTarget
} from "../../../../states/useSelectionTarget"
import { overrideSelectionCandidates } from "./selectionCandidates"

createEffect(() => {
    if (!getEditorCurve()) return

    resetMultipleSelectionTargets()
    setSelectionTarget(undefined)

    const handle0 = new Cancellable()
    import("../../../Curve").then(({ default: Curve }) => {
        if (handle0.done) return

        const curve = new Curve()
        curve.helper = true
        overrideSelectionCandidates.add(curve.outerObject3d)
        handle0.then(() => {
            curve.helper = false
            overrideSelectionCandidates.delete(curve.outerObject3d)
            curve.points.length < 2 && curve.dispose()
        })

        handle0.watch(
            mouseEvents.on("click", (e) => {
                const selected = getSelectionTarget()
                setTimeout(() => {
                    if (handle0.done || getSelectionTarget() || selected) return
                    curve.addPoint(e.point)
                })
            })
        )
    })
    const handle1 = onSelectionTarget(({ target }) => {
        if (
            !target ||
            overrideSelectionCandidates.has(target.outerObject3d) ||
            getMultipleSelectionTargets().length
        )
            return

        setEditorMode("translate")
    })
    return () => {
        handle0.cancel()
        handle1.cancel()
    }
}, [getEditorCurve])

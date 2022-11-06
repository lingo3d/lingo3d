import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { mouseEvents } from "../../../../api/mouse"
import { setEditorMode } from "../../../../states/useEditorMode"
import { getEditorModeComputed } from "../../../../states/useEditorModeComputed"
import { resetMultipleSelectionTargets } from "../../../../states/useMultipleSelectionTargets"
import {
    getSelectionTarget,
    setSelectionTarget
} from "../../../../states/useSelectionTarget"
import { overrideSelectionCandidates } from "./selectionCandidates"

createEffect(() => {
    if (getEditorModeComputed() !== "curve") return

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
                setTimeout(() => {
                    if (handle0.done || getSelectionTarget()) return
                    curve.addPoint(e.point)
                })
            })
        )
    })
    const handle1 = getSelectionTarget((target) => {
        if (target && !overrideSelectionCandidates.has(target.outerObject3d))
            setEditorMode("translate")
    })
    return () => {
        handle0.cancel()
        handle1.cancel()
    }
}, [getEditorModeComputed])

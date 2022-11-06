import { Cancellable } from "@lincode/promiselikes"
import { createNestedEffect } from "@lincode/reactivity"
import { mouseEvents } from "../../../../api/mouse"
import { getEditing } from "../../../../states/useEditing"
import { getEditorMode } from "../../../../states/useEditorMode"
import { resetMultipleSelectionTargets } from "../../../../states/useMultipleSelectionTargets"
import {
    getSelectionTarget,
    setSelectionTarget
} from "../../../../states/useSelectionTarget"
import { overrideSelectionCandidates } from "./selectionCandidates"

export default () => {
    createNestedEffect(() => {
        if (!getEditing() || getEditorMode() !== "path") return

        resetMultipleSelectionTargets()
        setSelectionTarget(undefined)

        const handle = new Cancellable()
        import("../../../Curve").then(({ default: Curve }) => {
            if (handle.done) return

            const curve = new Curve()
            curve.helper = true
            overrideSelectionCandidates.add(curve.outerObject3d)
            handle.then(() => {
                curve.helper = false
                overrideSelectionCandidates.delete(curve.outerObject3d)
                curve.points.length < 2 && curve.dispose()
            })

            handle.watch(
                mouseEvents.on("click", (e) => {
                    setTimeout(() => {
                        if (handle.done || getSelectionTarget()) return
                        curve.addPoint(e.point)
                    })
                })
            )
        })
        return () => {
            handle.cancel()
        }
    }, [getEditing, getEditorMode])
}

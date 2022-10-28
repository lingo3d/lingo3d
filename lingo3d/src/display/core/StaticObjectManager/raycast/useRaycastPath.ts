import { Cancellable } from "@lincode/promiselikes"
import { createNestedEffect } from "@lincode/reactivity"
import { mouseEvents } from "../../../../api/mouse"
import { onSceneGraphChange } from "../../../../events/onSceneGraphChange"
import { onSelectionRecompute } from "../../../../events/onSelectionRecompute"
import {
    emitSelectionTarget,
    onSelectionTarget
} from "../../../../events/onSelectionTarget"
import { getEditing } from "../../../../states/useEditing"
import { getEditorMode } from "../../../../states/useEditorMode"
import { resetMultipleSelectionTargets } from "../../../../states/useMultipleSelectionTargets"
import {
    getSelectionTarget,
    setSelectionTarget
} from "../../../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../../../states/useTransformControlsDragging"
import Sphere from "../../../primitives/Sphere"
import { vec2Point } from "../../../utils/vec2Point"
import pickable from "./pickable"
import selectionCandidates, {
    getSelectionCandidates
} from "./selectionCandidates"

let pathObjects: Array<Sphere> = []

export default () => {
    createNestedEffect(() => {
        if (
            !getEditing() ||
            getTransformControlsDragging() ||
            getEditorMode() !== "path"
        )
            return

        getSelectionCandidates(pathObjects)
        const handle0 = onSceneGraphChange(() =>
            getSelectionCandidates(pathObjects)
        )
        const handle1 = onSelectionRecompute(() => {
            getSelectionCandidates(pathObjects)
            emitSelectionTarget()
        })

        const handle2 = new Cancellable()
        import("../../../Curve").then(({ default: Curve }) => {
            if (handle2.done) return

            const curve = new Curve()
            handle2.then(() => curve.dispose())

            handle2.watch(
                mouseEvents.on("click", (e) => {
                    setTimeout(() => {
                        if (handle2.done || getSelectionTarget()) return
                        emitSelectionTarget(curve.addPointWithHelper(e.point))
                    })
                })
            )
        })

        const handle3 = mouseEvents.on("click", () => emitSelectionTarget())
        const handle4 = pickable("click", selectionCandidates, (target) =>
            emitSelectionTarget(target)
        )
        const handle5 = onSelectionTarget(({ target }) => {
            resetMultipleSelectionTargets()
            setSelectionTarget(target)
        })

        return () => {
            handle0.cancel()
            handle1.cancel()
            handle2.cancel()
            handle3.cancel()
            handle4.cancel()
            handle5.cancel()

            if (getEditorMode() !== "path") {
                pathObjects = []
            }
        }
    }, [getEditing, getTransformControlsDragging, getEditorMode])
}

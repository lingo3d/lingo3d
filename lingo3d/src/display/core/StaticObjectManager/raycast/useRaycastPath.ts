import { Cancellable } from "@lincode/promiselikes"
import { createNestedEffect } from "@lincode/reactivity"
import { mouseEvents } from "../../../../api/mouse"
import { emitSelectionTarget } from "../../../../events/onSelectionTarget"
import { getEditing } from "../../../../states/useEditing"
import { getEditorMode } from "../../../../states/useEditorMode"
import { getTransformControlsDragging } from "../../../../states/useTransformControlsDragging"

export default () => {
    createNestedEffect(() => {
        if (
            !getEditing() ||
            getTransformControlsDragging() ||
            getEditorMode() !== "path"
        )
            return

        const handle = new Cancellable()
        import("../../../Curve").then(({ default: Curve }) => {
            if (handle.done) return

            const curve = new Curve()
            handle.then(() => curve.dispose())

            handle.watch(
                mouseEvents.on("click", (e) => {
                    setTimeout(() => {
                        if (handle.done) return
                        emitSelectionTarget(curve.addPointWithHelper(e.point))
                    })
                })
            )
        })
        return () => {
            handle.cancel()
        }
    }, [getEditing, getTransformControlsDragging, getEditorMode])
}

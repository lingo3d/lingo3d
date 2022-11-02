import { Cancellable } from "@lincode/promiselikes"
import { createNestedEffect } from "@lincode/reactivity"
import { mouseEvents } from "../../../../api/mouse"
import { emitSelectionTarget } from "../../../../events/onSelectionTarget"
import { getEditing } from "../../../../states/useEditing"
import { getEditorMode } from "../../../../states/useEditorMode"
import {
    getChildManagers,
    setSelectionFocus
} from "../../../../states/useSelectionFocus"
import { getSelectionTarget } from "../../../../states/useSelectionTarget"

export default () => {
    createNestedEffect(() => {
        if (!getEditing() || getEditorMode() !== "path") return

        const handle = new Cancellable()
        import("../../../Curve").then(({ default: Curve }) => {
            if (handle.done) return

            const curve = new Curve()
            handle.then(() => curve.dispose())

            handle.watch(
                mouseEvents.on("click", (e) => {
                    setTimeout(() => {
                        if (handle.done || getSelectionTarget()) return
                        const helper = curve.addPointWithHelper(e.point)
                        setSelectionFocus(getChildManagers(curve))
                        emitSelectionTarget(helper)
                    })
                })
            )
        })
        return () => {
            handle.cancel()
            console.log("here")
        }
    }, [getEditing, getEditorMode])
}

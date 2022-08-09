import { Cancellable } from "@lincode/promiselikes"
import { mouseEvents } from "../../../../api/mouse"
import { onSceneGraphChange } from "../../../../events/onSceneGraphChange"
import {
    emitSelectionTarget,
    onSelectionTarget
} from "../../../../events/onSelectionTarget"
import { resetMultipleSelectionTargets } from "../../../../states/useMultipleSelectionTargets"
import {
    getSelectionTarget,
    setSelectionTarget
} from "../../../../states/useSelectionTarget"
import pickable from "./pickable"
import selectionCandidates from "./selectionCandidates"

export default () => {
    const handle = new Cancellable()
    selectionCandidates.clear()

    import("../../../primitives/Sphere").then((module) => {
        const Sphere = module.default
        handle.watch(
            mouseEvents.on("click", (e) => {
                setTimeout(() => {
                    if (handle.done || getSelectionTarget()) return

                    const target = new Sphere()
                    target.scale = 0.1
                    target.placeAt(e.point)
                    target.name = "point" + selectionCandidates.size
                    selectionCandidates.add(target.outerObject3d)
                    emitSelectionTarget(target)
                })
            })
        )
    })
    const handle0 = onSceneGraphChange(() => {
        for (const obj of selectionCandidates)
            !obj.parent && selectionCandidates.delete(obj)
    })
    const handle1 = mouseEvents.on("click", () => emitSelectionTarget())
    const handle2 = pickable("click", selectionCandidates, (target) =>
        emitSelectionTarget(target)
    )
    const handle3 = onSelectionTarget(({ target }) => {
        resetMultipleSelectionTargets()
        setSelectionTarget(target)
    })

    return () => {
        handle.cancel()
        handle0.cancel()
        handle1.cancel()
        handle2.cancel()
        handle3.cancel()
    }
}

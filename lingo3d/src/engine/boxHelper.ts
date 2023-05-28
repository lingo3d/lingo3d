import { createEffect } from "@lincode/reactivity"
import { BoxHelper } from "three"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../states/useSelectionTarget"
import scene from "./scene"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import { ssrExcludeSet } from "../collections/ssrExcludeSet"
import { renderCheckExcludeSet } from "../collections/renderCheckExcludeSet"
import { multipleSelectionTargets } from "../collections/multipleSelectionTargets"
import MeshAppendable from "../display/core/MeshAppendable"
import { updateSystem } from "../systems/updateSystem"

createEffect(() => {
    const [selectionTarget] = selectionTargetPtr
    const target =
        selectionTarget instanceof MeshAppendable
            ? selectionTarget.object3d
            : undefined
    if (!target) return

    const boxHelper = new BoxHelper(target)
    scene.add(boxHelper)
    updateSystem.add(boxHelper)
    ssrExcludeSet.add(boxHelper)
    renderCheckExcludeSet.add(boxHelper)

    return () => {
        scene.remove(boxHelper)
        updateSystem.delete(boxHelper)
        boxHelper.dispose()
        ssrExcludeSet.delete(boxHelper)
        renderCheckExcludeSet.delete(boxHelper)
    }
}, [getSelectionTarget])

createEffect(() => {
    if (!multipleSelectionTargets.size) return

    const boxHelpers: Array<BoxHelper> = []
    for (const target of multipleSelectionTargets) {
        const boxHelper = new BoxHelper(target.object3d)
        scene.add(boxHelper)
        boxHelpers.push(boxHelper)
        updateSystem.add(boxHelper)
        ssrExcludeSet.add(boxHelper)
        renderCheckExcludeSet.add(boxHelper)
    }
    return () => {
        for (const boxHelper of boxHelpers) {
            updateSystem.delete(boxHelper)
            scene.remove(boxHelper)
            boxHelper.dispose()
            ssrExcludeSet.delete(boxHelper)
            renderCheckExcludeSet.delete(boxHelper)
        }
    }
}, [getMultipleSelectionTargets])

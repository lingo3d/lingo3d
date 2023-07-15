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
import { isTemplate } from "../typeGuards/isTemplate"

createEffect(() => {
    const [selectionTarget] = selectionTargetPtr
    if (isTemplate(selectionTarget)) return
    const target =
        selectionTarget instanceof MeshAppendable
            ? selectionTarget.$innerObject
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
        if (isTemplate(target)) continue
        const boxHelper = new BoxHelper(target.$innerObject)
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

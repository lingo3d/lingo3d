import { createEffect } from "@lincode/reactivity"
import { BoxHelper } from "three"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { addUpdateSystem, deleteUpdateSystem } from "../systems/updateSystem"
import scene from "./scene"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import { ssrExcludeSet } from "../collections/ssrExcludeSet"

createEffect(() => {
    const [selectionTarget] = selectionTargetPtr
    const isMeshAppendable = selectionTarget && "object3d" in selectionTarget
    if (isMeshAppendable && !selectionTarget.object3d.parent) return

    const target = isMeshAppendable ? selectionTarget.object3d : undefined
    if (!target) return

    const boxHelper = new BoxHelper(target)
    const frame = requestAnimationFrame(() => scene.add(boxHelper))
    addUpdateSystem(boxHelper)
    ssrExcludeSet.add(boxHelper)

    return () => {
        cancelAnimationFrame(frame)
        scene.remove(boxHelper)
        deleteUpdateSystem(boxHelper)
        boxHelper.dispose()
        ssrExcludeSet.delete(boxHelper)
    }
}, [getSelectionTarget])

createEffect(() => {
    const [targets] = getMultipleSelectionTargets()
    if (!targets.size) return

    const boxHelpers: Array<BoxHelper> = []
    for (const target of targets) {
        const boxHelper = new BoxHelper(target.object3d)
        scene.add(boxHelper)
        boxHelpers.push(boxHelper)
    }

    for (const boxHelper of boxHelpers) {
        addUpdateSystem(boxHelper)
        ssrExcludeSet.add(boxHelper)
    }

    return () => {
        for (const boxHelper of boxHelpers) {
            deleteUpdateSystem(boxHelper)
            scene.remove(boxHelper)
            boxHelper.dispose()
            ssrExcludeSet.delete(boxHelper)
        }
    }
}, [getMultipleSelectionTargets])

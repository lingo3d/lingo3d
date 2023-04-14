import { createEffect } from "@lincode/reactivity"
import { BoxHelper } from "three"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getSelectionNativeTarget } from "../states/useSelectionNativeTarget"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { addUpdateSystem, deleteUpdateSystem } from "../systems/updateSystem"
import scene from "./scene"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"

createEffect(() => {
    const [selectionTarget] = selectionTargetPtr
    const isMeshAppendable = selectionTarget && "object3d" in selectionTarget
    if (isMeshAppendable && !selectionTarget.object3d.parent) return

    const target =
        getSelectionNativeTarget() ??
        (isMeshAppendable ? selectionTarget.object3d : undefined)

    if (!target) return

    const boxHelper = new BoxHelper(target)
    const frame = requestAnimationFrame(() => scene.add(boxHelper))
    addUpdateSystem(boxHelper)

    return () => {
        cancelAnimationFrame(frame)
        scene.remove(boxHelper)
        deleteUpdateSystem(boxHelper)
        boxHelper.dispose()
    }
}, [getSelectionTarget, getSelectionNativeTarget])

createEffect(() => {
    const [targets] = getMultipleSelectionTargets()
    if (!targets.size) return

    const boxHelpers: Array<BoxHelper> = []
    for (const target of targets) {
        const boxHelper = new BoxHelper(target.object3d)
        scene.add(boxHelper)
        boxHelpers.push(boxHelper)
    }

    for (const boxHelper of boxHelpers) addUpdateSystem(boxHelper)

    return () => {
        for (const boxHelper of boxHelpers) {
            deleteUpdateSystem(boxHelper)
            scene.remove(boxHelper)
            boxHelper.dispose()
        }
    }
}, [getMultipleSelectionTargets])

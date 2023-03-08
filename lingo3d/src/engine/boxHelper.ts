import { createEffect } from "@lincode/reactivity"
import { BoxHelper } from "three"
import {
    addUpdateSystem,
    deleteUpdateSystem
} from "../display/core/utils/updateSystem"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getSelectionNativeTarget } from "../states/useSelectionNativeTarget"
import { getSelectionTarget } from "../states/useSelectionTarget"
import scene from "./scene"

createEffect(() => {
    const selectionTarget = getSelectionTarget()
    const isMeshAppendable =
        selectionTarget && "outerObject3d" in selectionTarget
    if (isMeshAppendable && !selectionTarget.outerObject3d.parent) return

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
    }
}, [getSelectionTarget, getSelectionNativeTarget])

createEffect(() => {
    const [targets] = getMultipleSelectionTargets()
    if (!targets.size) return

    const boxHelpers: Array<BoxHelper> = []
    for (const target of targets) {
        const boxHelper = new BoxHelper(target.outerObject3d)
        scene.add(boxHelper)
        boxHelpers.push(boxHelper)
    }

    for (const boxHelper of boxHelpers) addUpdateSystem(boxHelper)

    return () => {
        for (const boxHelper of boxHelpers) {
            deleteUpdateSystem(boxHelper)
            scene.remove(boxHelper)
        }
    }
}, [getMultipleSelectionTargets])

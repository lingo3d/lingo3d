import { createEffect } from "@lincode/reactivity"
import { BoxHelper } from "three"
import { onBeforeRender } from "../events/onBeforeRender"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getSelectionNativeTarget } from "../states/useSelectionNativeTarget"
import { getSelectionTarget } from "../states/useSelectionTarget"
import scene from "./scene"

createEffect(() => {
    const selectionTarget = getSelectionTarget()
    const target =
        getSelectionNativeTarget() ??
        (selectionTarget && "object3d" in selectionTarget
            ? selectionTarget.object3d
            : undefined)

    if (!target) return

    const boxHelper = new BoxHelper(target)
    const frame = requestAnimationFrame(() => scene.add(boxHelper))
    const handle = onBeforeRender(() => boxHelper.update())

    return () => {
        cancelAnimationFrame(frame)
        scene.remove(boxHelper)
        handle.cancel()
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

    const handle = onBeforeRender(() => {
        for (const boxHelper of boxHelpers) boxHelper.update()
    })

    return () => {
        for (const boxHelper of boxHelpers) scene.remove(boxHelper)

        handle.cancel()
    }
}, [getMultipleSelectionTargets])

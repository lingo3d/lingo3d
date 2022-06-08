import { createEffect } from "@lincode/reactivity"
import { BoxHelper } from "three"
import { getCameraRendered } from "../states/useCameraRendered"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { loop } from "./eventLoop"
import mainCamera from "./mainCamera"
import scene from "./scene"

export default {}

createEffect(() => {
    const target = getSelectionTarget()
    if (!target || getCameraRendered() !== mainCamera) return

    //@ts-ignore
    const boxHelper = new BoxHelper(target.object3d ?? target.outerObject3d)
    const frame = requestAnimationFrame(() => scene.add(boxHelper))
    const handle = loop(() => boxHelper.update())

    return () => {
        cancelAnimationFrame(frame)
        scene.remove(boxHelper)
        handle.cancel()
    }
}, [getSelectionTarget, getCameraRendered])

createEffect(() => {
    const targets = getMultipleSelectionTargets()
    if (!targets.length || getCameraRendered() !== mainCamera) return

    const boxHelpers: Array<BoxHelper> = []
    for (const target of targets) {
        const boxHelper = new BoxHelper(target.outerObject3d)
        scene.add(boxHelper)
        boxHelpers.push(boxHelper)
    }

    const handle = loop(() => {
        for (const boxHelper of boxHelpers)
            boxHelper.update()
    })

    return () => {
        for (const boxHelper of boxHelpers)
            scene.remove(boxHelper)
            
        handle.cancel()
    }
}, [getMultipleSelectionTargets, getCameraRendered])
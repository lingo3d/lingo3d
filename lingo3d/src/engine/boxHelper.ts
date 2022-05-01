import { createEffect } from "@lincode/reactivity"
import { BoxHelper } from "three"
import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { getCamera } from "../states/useCamera"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { loop } from "./eventLoop"
import mainCamera from "./mainCamera"
import scene from "./scene"

export default {}

createEffect(() => {
    const target = getSelectionTarget()
    if (!(target instanceof SimpleObjectManager) || getCamera() !== mainCamera) return

    const boxHelper = new BoxHelper(target.object3d)
    scene.add(boxHelper)

    const handle = loop(() => boxHelper.update())

    return () => {
        scene.remove(boxHelper)
        handle.cancel()
    }
}, [getSelectionTarget, getCamera])

createEffect(() => {
    const targets = getMultipleSelectionTargets()
    if (!targets.length || getCamera() !== mainCamera) return

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
}, [getMultipleSelectionTargets, getCamera])
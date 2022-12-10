import { createEffect } from "@lincode/reactivity"
import { onBeforeRender } from "../../../../events/onBeforeRender"
import { getPhysX } from "../../../../states/usePhysX"

createEffect(() => {
    const { PhysX, scene } = getPhysX()
    if (!PhysX) return

    // simulate scene for a bit
    const handle = onBeforeRender(() => {
        scene.simulate(1.0 / 60.0)
        scene.fetchResults(true)
        // const boxHeight = box.getGlobalPose().get_p().get_y()
        // console.log("Sim step " + i + ": h = " + boxHeight)
    })
    return () => {
        handle.cancel()
    }
}, [getPhysX])

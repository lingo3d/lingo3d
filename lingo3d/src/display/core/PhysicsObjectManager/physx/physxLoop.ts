import { createEffect } from "@lincode/reactivity"
import { onBeforeRender } from "../../../../events/onBeforeRender"
import { getPhysX } from "../../../../states/usePhysX"
import "../../../../engine/eventLoop"
import { dtPtr } from "../../../../engine/eventLoop"
import objectActorMap from "./objectActorMap"

createEffect(() => {
    const { PhysX, scene } = getPhysX()
    if (!PhysX) return

    // simulate scene for a bit
    const handle = onBeforeRender(() => {
        scene.simulate(1 / 60)
        // scene.simulate(dtPtr[0])
        scene.fetchResults(true)

        for (const [target, body] of objectActorMap) {
            const { p, q } = body.getGlobalPose()
            target.position.copy(p)
            target.quaternion.copy(q)
        }

        // const boxHeight = box.getGlobalPose().get_p().get_y()
        // console.log("Sim step " + i + ": h = " + boxHeight)
    })
    return () => {
        handle.cancel()
    }
}, [getPhysX])

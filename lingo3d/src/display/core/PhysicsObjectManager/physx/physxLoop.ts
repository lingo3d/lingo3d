import { createEffect } from "@lincode/reactivity"
import { onBeforeRender } from "../../../../events/onBeforeRender"
import { getPhysX } from "../../../../states/usePhysX"
import "../../../../engine/eventLoop"
import { dtPtr } from "../../../../engine/eventLoop"
import objectActorMap from "./objectActorMap"

createEffect(() => {
    const { scene } = getPhysX()
    if (!scene) return

    const handle = onBeforeRender(() => {
        scene.simulate(1 / 60)
        // scene.simulate(dtPtr[0])
        scene.fetchResults(true)

        for (const [target, body] of objectActorMap) {
            const { p, q } = body.getGlobalPose()
            target.position.copy(p)
            target.quaternion.copy(q)
        }
    })
    return () => {
        handle.cancel()
    }
}, [getPhysX])

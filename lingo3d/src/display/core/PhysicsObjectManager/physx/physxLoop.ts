import { createEffect } from "@lincode/reactivity"
import { onBeforeRender } from "../../../../events/onBeforeRender"
import { getPhysX } from "../../../../states/usePhysX"
import "../../../../engine/eventLoop"
import { dtPtr } from "../../../../engine/eventLoop"
import objectActorMap from "./objectActorMap"

createEffect(() => {
    const { pxScene } = getPhysX()
    if (!pxScene) return

    const handle = onBeforeRender(() => {
        pxScene.simulate(1 / 60)
        // pxScene.simulate(dtPtr[0])
        pxScene.fetchResults(true)

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

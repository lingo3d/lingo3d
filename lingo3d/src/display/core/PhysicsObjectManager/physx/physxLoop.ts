import { createEffect } from "@lincode/reactivity"
import { onBeforeRender } from "../../../../events/onBeforeRender"
import { getPhysX } from "../../../../states/usePhysX"
import "../../../../engine/eventLoop"
import { dtPtr } from "../../../../engine/eventLoop"
import objectActorMap, { objectCharacterActorMap } from "./objectActorMap"

createEffect(() => {
    const { scene } = getPhysX()
    if (!scene) return

    const handle = onBeforeRender(() => {
        scene.simulate(1 / 60)
        // scene.simulate(dtPtr[0])
        scene.fetchResults(true)

        for (const [target, actor] of objectActorMap) {
            const { p, q } = actor.getGlobalPose()
            target.position.copy(p)
            target.quaternion.copy(q)
        }
        for (const [target, actor] of objectCharacterActorMap) {
            const { p } = actor.getGlobalPose()
            target.position.copy(p)
        }
    })
    return () => {
        handle.cancel()
    }
}, [getPhysX])

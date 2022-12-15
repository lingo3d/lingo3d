import { createEffect } from "@lincode/reactivity"
import { onBeforeRender } from "../../../../events/onBeforeRender"
import { getPhysX } from "../../../../states/usePhysX"
import "../../../../engine/eventLoop"
import objectActorMap, { objectCharacterActorMap } from "./objectActorMap"
import { getPhysXCookingCount } from "../../../../states/usePhysXCookingCount"
import { DT } from "../../../../globals"

createEffect(() => {
    const { scene } = getPhysX()
    if (!scene || getPhysXCookingCount()) return

    const handle = onBeforeRender(() => {
        scene.simulate(DT)
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
}, [getPhysX, getPhysXCookingCount])

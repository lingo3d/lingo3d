import { createEffect } from "@lincode/reactivity"
import { onBeforeRender } from "../../../../events/onBeforeRender"
import { getPhysX } from "../../../../states/usePhysX"
import "../../../../engine/eventLoop"
import {
    objectActorMap,
    managerControllerMap,
    objectCharacterActorMap,
    controllerActorMap
} from "./pxMaps"
import { getPhysXCookingCount } from "../../../../states/usePhysXCookingCount"
import { getEditorPlay } from "../../../../states/useEditorPlay"
import { getFirstLoad } from "../../../../states/useFirstLoad"
import { dtPtr } from "../../../../engine/eventLoop"
import { FRAME2SEC } from "../../../../globals"

createEffect(() => {
    const { scene, pxVec, getPxControllerFilters } = getPhysX()
    if (!scene || getPhysXCookingCount() || !getEditorPlay() || !getFirstLoad())
        return

    const handle = onBeforeRender(() => {
        if (managerControllerMap.size) {
            pxVec.set_x(0)
            pxVec.set_y(-9.81 * FRAME2SEC * FRAME2SEC * 10)
            pxVec.set_z(0)
            const filters = getPxControllerFilters()

            for (const controller of managerControllerMap.values()) {
                controller.move(pxVec, 0.001, dtPtr[0], filters)
                const actor = controllerActorMap.get(controller)
                console.log(actor)
            }
        }

        scene.simulate(dtPtr[0])
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
}, [getPhysX, getPhysXCookingCount, getEditorPlay, getFirstLoad])

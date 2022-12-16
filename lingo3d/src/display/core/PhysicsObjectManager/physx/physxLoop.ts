import { createEffect } from "@lincode/reactivity"
import { onBeforeRender } from "../../../../events/onBeforeRender"
import { getPhysX } from "../../../../states/usePhysX"
import "../../../../engine/eventLoop"
import { managerActorMap, managerControllerMap } from "./pxMaps"
import { getPhysXCookingCount } from "../../../../states/usePhysXCookingCount"
import { getEditorPlay } from "../../../../states/useEditorPlay"
import { getFirstLoad } from "../../../../states/useFirstLoad"
import { dtPtr } from "../../../../engine/eventLoop"
import { setPxVec } from "./updatePxVec"

createEffect(() => {
    const { scene, getPxControllerFilters } = getPhysX()
    if (!scene || getPhysXCookingCount() || !getEditorPlay() || !getFirstLoad())
        return

    const handle = onBeforeRender(() => {
        if (managerControllerMap.size) {
            const filters = getPxControllerFilters()

            for (const [manager, controller] of managerControllerMap) {
                const vy = controller.getActor().getLinearVelocity().get_y()
                // (vy - 9.81 * dtPtr[0]) * dtPtr[0]
                const dy = (vy - 1) * dtPtr[0]

                if (manager.pxUpdate) {
                    manager.pxUpdate = false
                    const {
                        x: px,
                        y: py,
                        z: pz
                    } = manager.outerObject3d.position
                    const { x: cx, y: cy, z: cz } = controller.getPosition()

                    controller.move(
                        setPxVec(px - cx, py - cy + dy, pz - cz),
                        0.001,
                        dtPtr[0],
                        filters
                    )
                } else
                    controller.move(
                        setPxVec(0, dy, 0),
                        0.001,
                        dtPtr[0],
                        filters
                    )
            }
        }
        scene.simulate(dtPtr[0])
        scene.fetchResults(true)

        for (const [manager, actor] of managerActorMap) {
            const { p, q } = actor.getGlobalPose()
            manager.outerObject3d.position.copy(p)
            manager.outerObject3d.quaternion.copy(q)
        }
        for (const [manager, controller] of managerControllerMap)
            manager.outerObject3d.position.copy(
                controller.getActor().getGlobalPose().p
            )
    })
    return () => {
        handle.cancel()
    }
}, [getPhysX, getPhysXCookingCount, getEditorPlay, getFirstLoad])

import { createEffect } from "@lincode/reactivity"
import { onBeforeRender } from "../../../../events/onBeforeRender"
import { getPhysX } from "../../../../states/usePhysX"
import "../../../../engine/eventLoop"
import { managerActorMap, managerControllerMap } from "./pxMaps"
import { getPhysXCookingCount } from "../../../../states/usePhysXCookingCount"
import { getEditorPlay } from "../../../../states/useEditorPlay"
import { getFirstLoad } from "../../../../states/useFirstLoad"
import { dtPtr } from "../../../../engine/eventLoop"
import { setPxPose, setPxVec, setPxVec_ } from "./updatePxVec"
import PhysicsObjectManager from ".."

export const pxUpdateSet = new Set<PhysicsObjectManager>()

createEffect(() => {
    const { scene, pxControllerFilters, pxRaycast } = getPhysX()
    if (!scene || getPhysXCookingCount() || !getEditorPlay() || !getFirstLoad())
        return

    const handle = onBeforeRender(() => {
        for (const [manager, controller] of managerControllerMap) {
            const { x: px, y: py, z: pz } = manager.outerObject3d.position
            const hit = pxRaycast!(
                setPxVec(px, py, pz),
                setPxVec_(0, -1, 0),
                manager.pxHeight! * 1.5,
                manager.actor.ptr
            )
            const vy = manager.actor.getLinearVelocity().get_y()
            const dy = hit
                ? (vy - 10) * dtPtr[0]
                : (vy - 9.81 * dtPtr[0]) * dtPtr[0]

            if (pxUpdateSet.has(manager)) {
                pxUpdateSet.delete(manager)

                const { x: cx, y: cy, z: cz } = controller.getPosition()

                controller.move(
                    setPxVec(px - cx, py - cy + dy, pz - cz),
                    0.001,
                    dtPtr[0],
                    pxControllerFilters
                )
            } else
                controller.move(
                    setPxVec(0, dy, 0),
                    0.001,
                    dtPtr[0],
                    pxControllerFilters
                )
        }
        for (const manager of pxUpdateSet)
            manager.actor.setGlobalPose(setPxPose(manager.outerObject3d))

        pxUpdateSet.clear()

        scene.simulate(dtPtr[0])
        scene.fetchResults(true)

        for (const [manager, actor] of managerActorMap) {
            const { p, q } = actor.getGlobalPose()
            manager.outerObject3d.position.copy(p)
            manager.outerObject3d.quaternion.copy(q)
        }
        for (const manager of managerControllerMap.keys())
            manager.outerObject3d.position.copy(manager.actor.getGlobalPose().p)
    })
    return () => {
        handle.cancel()
    }
}, [getPhysX, getPhysXCookingCount, getEditorPlay, getFirstLoad])

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
import fpsAlpha from "../../../utils/fpsAlpha"
import { gravityPtr } from "../../../../states/useGravity"

export const pxUpdateSet = new Set<PhysicsObjectManager>()
export const pxVYUpdateMap = new Map<PhysicsObjectManager, number>()

const hitMap = new WeakMap<PhysicsObjectManager, boolean>()
const vyMap = new WeakMap<PhysicsObjectManager, number>()

createEffect(() => {
    const { scene, pxControllerFilters, pxRaycast } = getPhysX()
    if (!scene || getPhysXCookingCount() || !getEditorPlay() || !getFirstLoad())
        return

    const handle = onBeforeRender(() => {
        for (const [manager, controller] of managerControllerMap) {
            const vyUpdate = pxVYUpdateMap.get(manager)
            pxVYUpdateMap.delete(manager)

            const { x: px, y: py, z: pz } = manager.outerObject3d.position
            let dy = vyUpdate === undefined ? 0 : vyUpdate * dtPtr[0]
            if (manager.gravity !== false && vyUpdate === undefined) {
                const capsuleHeight = manager.capsuleHeight!
                const hit = !!pxRaycast!(
                    setPxVec(px, py, pz),
                    setPxVec_(0, -1, 0),
                    capsuleHeight,
                    manager.actor.ptr
                )
                hitMap.set(manager, hit)
                const vy = hit
                    ? 0
                    : (vyMap.get(manager) ?? 0) + gravityPtr[0] * dtPtr[0]
                vyMap.set(manager, vy)
                dy = hit ? -capsuleHeight : vy * dtPtr[0]
            }
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
        for (const manager of managerControllerMap.keys()) {
            const { position } = manager.outerObject3d
            const { p } = manager.actor.getGlobalPose()
            position.lerp(p, fpsAlpha(hitMap.get(manager) ? 0.4 : 1))
            position.x = p.x
            position.z = p.z
        }
    })
    return () => {
        handle.cancel()
    }
}, [getPhysX, getPhysXCookingCount, getEditorPlay, getFirstLoad])

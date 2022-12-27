import { createEffect } from "@lincode/reactivity"
import { getPhysX } from "../../../../states/usePhysX"
import "../../../../engine/eventLoop"
import { managerActorMap, managerControllerMap } from "./pxMaps"
import { getPhysXCookingCount } from "../../../../states/usePhysXCookingCount"
import { getWorldPlayComputed } from "../../../../states/useWorldPlayComputed"
import { getFirstLoad } from "../../../../states/useFirstLoad"
import { dtPtr } from "../../../../engine/eventLoop"
import { assignPxPose, setPxVec, setPxVec_ } from "./updatePxVec"
import PhysicsObjectManager from ".."
import fpsAlpha from "../../../utils/fpsAlpha"
import { gravityPtr } from "../../../../states/useGravity"
import StaticObjectManager from "../../StaticObjectManager"
import { onPhysXLoop } from "../../../../events/onPhysXLoop"

export const pxUpdateSet = new Set<PhysicsObjectManager>()
export const pxVXUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const pxVYUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const pxVZUpdateMap = new WeakMap<PhysicsObjectManager, number>()

const hitMap = new WeakMap<PhysicsObjectManager, boolean>()
const vyMap = new WeakMap<PhysicsObjectManager, number>()

const lockHitSet = new WeakSet<StaticObjectManager>()
const lockHit = (manager: StaticObjectManager, lock: boolean) => {
    if (lockHitSet.has(manager)) return true
    if (lock) {
        lockHitSet.add(manager)
        setTimeout(() => lockHitSet.delete(manager), 500)
        return true
    }
    return false
}

export const groundedControllerManagers = new Set<PhysicsObjectManager>()

createEffect(() => {
    const { scene, pxControllerFilters, pxRaycast } = getPhysX()
    if (
        !scene ||
        getPhysXCookingCount() ||
        !getWorldPlayComputed() ||
        !getFirstLoad()
    )
        return

    const handle = onPhysXLoop(() => {
        groundedControllerManagers.clear()

        for (const [manager, controller] of managerControllerMap) {
            const { x: px, y: py, z: pz } = manager.outerObject3d.position

            let dy = 0
            const vyUpdate = pxVYUpdateMap.get(manager)
            pxVYUpdateMap.delete(manager)

            const dx = pxVXUpdateMap.get(manager) ?? 0
            const dz = pxVZUpdateMap.get(manager) ?? 0

            if (manager.gravity !== false) {
                const hit = lockHit(manager, vyUpdate !== undefined)
                    ? false
                    : !!pxRaycast!(
                          setPxVec(px, py, pz),
                          setPxVec_(0, -1, 0),
                          manager.capsuleHeight!,
                          manager.actor.ptr
                      )
                hitMap.set(manager, hit)

                if (hit) {
                    dy = -manager.capsuleHeight!
                    vyMap.set(manager, 0)
                    groundedControllerManagers.add(manager)
                    pxVXUpdateMap.delete(manager)
                    pxVZUpdateMap.delete(manager)
                } else {
                    const vy =
                        (vyUpdate ?? vyMap.get(manager) ?? 0) +
                        gravityPtr[0] * dtPtr[0]
                    vyMap.set(manager, vy)
                    dy = vy * dtPtr[0]
                }
            } else hitMap.set(manager, false)

            if (pxUpdateSet.has(manager)) {
                pxUpdateSet.delete(manager)

                const { x: cx, y: cy, z: cz } = controller.getPosition()

                controller.move(
                    setPxVec(px - cx + dx, py - cy + dy, pz - cz + dz),
                    0.001,
                    dtPtr[0],
                    pxControllerFilters
                )
            } else
                controller.move(
                    setPxVec(dx, dy, dz),
                    0.001,
                    dtPtr[0],
                    pxControllerFilters
                )
        }
        for (const manager of pxUpdateSet)
            manager.actor.setGlobalPose(assignPxPose(manager.outerObject3d))
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
            position.lerp(p, fpsAlpha(hitMap.get(manager) ? 0.3 : 1))
            position.x = p.x
            position.z = p.z
        }
    })
    return () => {
        handle.cancel()
    }
}, [getPhysX, getPhysXCookingCount, getWorldPlayComputed, getFirstLoad])

import { createEffect } from "@lincode/reactivity"
import "../eventLoop"
import { getWorldPlayComputed } from "../../states/useWorldPlayComputed"
import { getFirstLoad } from "../../states/useFirstLoad"
import { assignPxTransform, setPxVec, setPxVec_ } from "./pxMath"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import fpsAlpha from "../../display/utils/fpsAlpha"
import { onPhysXLoop } from "../../events/onPhysXLoop"
import { physxPtr } from "../../pointers/physxPtr"
import { getPhysXLoaded } from "../../states/usePhysXLoaded"
import MeshAppendable from "../../api/core/MeshAppendable"
import {
    pxVYUpdateMap,
    pxVXUpdateMap,
    pxVZUpdateMap,
    pxUpdateSet,
    groundedControllerManagers,
    managerActorMap,
    managerControllerMap
} from "../../collections/pxCollections"
import { dtPtr } from "../../pointers/dtPtr"
import { gravityPtr } from "../../pointers/gravityPtr"

const hitMap = new WeakMap<PhysicsObjectManager, boolean>()
const vyMap = new WeakMap<PhysicsObjectManager, number>()

const lockHitSet = new WeakSet<MeshAppendable>()
const lockHit = (manager: MeshAppendable, lock: boolean) => {
    if (lockHitSet.has(manager)) return true
    if (lock) {
        lockHitSet.add(manager)
        setTimeout(() => lockHitSet.delete(manager), 500)
        return true
    }
    return false
}

createEffect(() => {
    const { pxScene, pxControllerFilters, pxRaycast } = physxPtr[0]
    if (!pxScene || !getWorldPlayComputed() || !getFirstLoad()) return

    const handle = onPhysXLoop(() => {
        groundedControllerManagers.clear()

        for (const [manager, controller] of managerControllerMap) {
            const { x: px, y: py, z: pz } = manager.position

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
        for (const manager of pxUpdateSet) {
            manager.actor.setGlobalPose(assignPxTransform(manager))
            if (!("setLinearVelocity" in manager.actor)) continue
            manager.actor.setLinearVelocity(setPxVec(0, 0, 0))
            manager.actor.setAngularVelocity(setPxVec(0, 0, 0))
        }
        pxUpdateSet.clear()

        pxScene.simulate(dtPtr[0])
        pxScene.fetchResults(true)

        for (const [manager, actor] of managerActorMap) {
            const { p, q } = actor.getGlobalPose()
            manager.position.copy(p)
            manager.quaternion.copy(q)
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
}, [getPhysXLoaded, getWorldPlayComputed, getFirstLoad])

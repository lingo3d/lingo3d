import { createEffect } from "@lincode/reactivity"
import "../eventLoop"
import { setPxVec, setPxVec_ } from "./pxMath"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import fpsAlpha from "../../display/utils/fpsAlpha"
import { onPhysics } from "../../events/onPhysics"
import { physxPtr } from "../../pointers/physxPtr"
import { getPhysXLoaded } from "../../states/usePhysXLoaded"
import MeshAppendable from "../../display/core/MeshAppendable"
import {
    controllerVYUpdateMap,
    controllerVXUpdateMap,
    controllerVZUpdateMap,
    groundedControllerManagers,
    managerActorMap,
    managerControllerMap
} from "../../collections/pxCollections"
import { dtPtr } from "../../pointers/dtPtr"
import { gravityPtr } from "../../pointers/gravityPtr"
import { physxLoopPtr } from "../../pointers/physxLoopPtr"
import { getWorldPlay } from "../../states/useWorldPlay"
import { worldPlayPtr } from "../../pointers/worldPlayPtr"
import math from "../../math"

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
    if (!pxScene || worldPlayPtr[0] !== "live") return

    physxLoopPtr[0] = true
    const handle = onPhysics(() => {
        groundedControllerManagers.clear()

        for (const [manager, controller] of managerControllerMap) {
            const { x: px, y: py, z: pz } = manager.position

            let dy = 0
            const vyUpdate = controllerVYUpdateMap.get(manager)
            controllerVYUpdateMap.delete(manager)

            const dx = controllerVXUpdateMap.get(manager) ?? 0
            const dz = controllerVZUpdateMap.get(manager) ?? 0

            if (manager.gravity !== false) {
                const hit = lockHit(manager, vyUpdate !== undefined)
                    ? false
                    : !!pxRaycast(
                          setPxVec(px, py, pz),
                          setPxVec_(0, -1, 0),
                          manager.$capsuleHeight!,
                          manager.$actor.ptr
                      )
                if (hit) {
                    dy = -manager.$capsuleHeight!
                    vyMap.set(manager, 0)
                    groundedControllerManagers.add(manager)
                    controllerVXUpdateMap.delete(manager)
                    controllerVZUpdateMap.delete(manager)
                } else {
                    const vy =
                        (vyUpdate ?? vyMap.get(manager) ?? 0) +
                        gravityPtr[0] * dtPtr[0]
                    vyMap.set(manager, vy)
                    dy = vy * dtPtr[0]
                }
            }

            if (manager.$controllerMove) {
                const { x, y, z } = manager.$controllerMove
                controller.move(
                    setPxVec(x + dx, y + dy, z + dz),
                    0.001,
                    dtPtr[0],
                    pxControllerFilters
                )
                manager.$controllerMove = undefined
            } else
                controller.move(
                    setPxVec(dx, dy, dz),
                    0.001,
                    dtPtr[0],
                    pxControllerFilters
                )
        }
        pxScene.simulate(dtPtr[0])
        pxScene.fetchResults(true)

        for (const [manager, actor] of managerActorMap) {
            const { p, q } = actor.getGlobalPose()
            manager.position.copy(p)
            manager.quaternion.copy(q)
        }
        for (const manager of managerControllerMap.keys()) {
            const { position } = manager.outerObject3d
            const { p } = manager.$actor.getGlobalPose()
            position.x = p.x
            position.y = groundedControllerManagers.has(manager)
                ? math.lerp(position.y, p.y, fpsAlpha(0.3))
                : p.y
            position.z = p.z
        }
    })
    return () => {
        handle.cancel()
        physxLoopPtr[0] = false
    }
}, [getPhysXLoaded, getWorldPlay])

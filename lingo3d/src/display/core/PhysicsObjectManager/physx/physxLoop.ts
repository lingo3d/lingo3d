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
import { FAR } from "../../../../globals"
import { Vector3 } from "three"
import { forceGet } from "@lincode/utils"
import { vector3 } from "../../../utils/reusables"
import fpsAlpha from "../../../utils/fpsAlpha"

export const pxUpdateSet = new Set<PhysicsObjectManager>()

const managerVectorMap = new WeakMap<PhysicsObjectManager, Vector3>()

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
                FAR,
                manager.actor.ptr
            )

            let dy = hit ? hit.position.y + manager.pxHeight - py : 0
            dy = forceGet(
                managerVectorMap,
                manager,
                () => new Vector3(0, dy, 0)
            ).lerp(vector3.set(0, dy, 0), fpsAlpha(dy < 0 ? 0.05 : 1)).y

            const { x: cx, y: cy, z: cz } = controller.getPosition()

            controller.move(
                setPxVec(px - cx, py - cy + dy, pz - cz),
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

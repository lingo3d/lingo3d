import { Raycaster, Object3D } from "three"
import StaticObjectManager from ".."
import { MouseEventName, mouseEvents } from "../../../../api/mouse"
import { getManager } from "../../../../api/utils/getManager"
import { FAR, M2CM } from "../../../../globals"
import { LingoMouseEvent } from "../../../../interface/IMouse"
import { getCameraRendered } from "../../../../states/useCameraRendered"
import { getSelectionFocus } from "../../../../states/useSelectionFocus"
import { vec2Point } from "../../../utils/vec2Point"
import { physxPtr } from "../../PhysicsObjectManager/physx/physxPtr"
import { actorPtrManagerMap } from "../../PhysicsObjectManager/physx/pxMaps"
import {
    assignPxVec,
    assignPxVec_
} from "../../PhysicsObjectManager/physx/pxMath"
import { unselectableSet } from "./selectionCandidates"

const raycaster = new Raycaster()

const filterUnselectable = (target: Object3D) => !unselectableSet.has(target)

export const raycast = async (
    x: number,
    y: number,
    candidates: Set<Object3D>
) => {
    raycaster.setFromCamera({ x, y }, getCameraRendered())
    const intersection = raycaster.intersectObjects(
        [...candidates].filter(filterUnselectable)
    )[0]

    const focusedManager = getSelectionFocus()
    if (focusedManager) {
        const { getFoundManager } = await import(
            "../../../../api/utils/getFoundManager"
        )
        if (intersection)
            return {
                point: vec2Point(intersection.point),
                distance: intersection.distance * M2CM,
                manager: getFoundManager(intersection.object, focusedManager)
            }
    }

    const pxHit = physxPtr[0].pxRaycast?.(
        assignPxVec(raycaster.ray.origin),
        assignPxVec_(raycaster.ray.direction),
        FAR
    )
    if (pxHit && (!intersection || pxHit.distance < intersection.distance)) {
        const manager = actorPtrManagerMap.get(pxHit.actor.ptr)!
        if (
            (manager.physics === "map" || manager.physics === "convex") &&
            "loadedGroup" in manager
        ) {
            const { object3d } = manager
            if (unselectableSet.has(object3d) || !candidates.has(object3d))
                return

            return {
                point: vec2Point(pxHit.position),
                distance: pxHit.distance * M2CM,
                manager
            }
        }
    }
    if (intersection)
        return {
            point: vec2Point(intersection.point),
            distance: intersection.distance * M2CM,
            manager: getManager<StaticObjectManager>(intersection.object)!
        }
}

type Then = (obj: StaticObjectManager, e: LingoMouseEvent) => void

export default (
    name: MouseEventName | Array<MouseEventName>,
    candidates: Set<Object3D>,
    then: Then
) => {
    const handle = mouseEvents.on(name, async (e) => {
        const result = await raycast(e.xNorm, e.yNorm, candidates)
        if (!result || handle.done) return

        const { point, distance, manager } = result

        then(
            manager,
            new LingoMouseEvent(
                e.canvasX,
                e.canvasY,
                e.clientX,
                e.clientY,
                e.xNorm,
                e.yNorm,
                point,
                distance,
                manager
            )
        )
    })
    return handle
}

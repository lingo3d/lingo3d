import { Raycaster, Object3D } from "three"
import StaticObjectManager from ".."
import { MouseEventName, mouseEvents } from "../../../../api/mouse"
import { getManager } from "../../../../api/utils/manager"
import { scaleUp } from "../../../../engine/constants"
import { LingoMouseEvent } from "../../../../interface/IMouse"
import { getCameraRendered } from "../../../../states/useCameraRendered"
import { getPhysX } from "../../../../states/usePhysX"
import getWorldDirection from "../../../utils/getWorldDirection"
import getWorldPosition from "../../../utils/getWorldPosition"
import { vec2Point } from "../../../utils/vec2Point"
import { actorManagerMap } from "../../PhysicsObjectManager/physx/pxMaps"
import {
    assignPxVec,
    assignPxVec_
} from "../../PhysicsObjectManager/physx/updatePxVec"

const raycaster = new Raycaster()

const filterUnselectable = (target: Object3D) => {
    if (target.userData.unselectable || target.userData.physx) return false
    return true
}

const pxRaycast = () => {
    const { getRaycast } = getPhysX()
    if (!getRaycast) return

    const raycast = getRaycast()
    const camera = getCameraRendered()
    return raycast(
        assignPxVec(getWorldPosition(camera)),
        assignPxVec_(getWorldDirection(camera)),
        9999
    )
}

export const raycast = (x: number, y: number, candidates: Set<Object3D>) => {
    raycaster.setFromCamera({ x, y }, getCameraRendered())
    const intersection = raycaster.intersectObjects(
        [...candidates].filter(filterUnselectable)
    )[0]
    const pxBlock = pxRaycast()
    if (
        (pxBlock && intersection && pxBlock.distance < intersection.distance) ||
        (pxBlock && !intersection)
    ) {
        return {
            point: vec2Point(pxBlock.position),
            distance: pxBlock.distance * scaleUp,
            manager: actorManagerMap.get(pxBlock.actor)!
        }
    }
    if (
        (pxBlock && intersection && pxBlock.distance > intersection.distance) ||
        (!pxBlock && intersection)
    )
        return {
            point: vec2Point(intersection.point),
            distance: intersection.distance * scaleUp,
            manager: getManager<StaticObjectManager>(intersection.object)
        }
}

type Then = (obj: StaticObjectManager, e: LingoMouseEvent) => void

export default (
    name: MouseEventName | Array<MouseEventName>,
    candidates: Set<Object3D>,
    then: Then
) =>
    mouseEvents.on(name, (e) => {
        if (!candidates.size) return

        const result = raycast(e.xNorm, e.yNorm, candidates)
        if (!result) return

        const { point, distance, manager } = result

        then(
            manager,
            new LingoMouseEvent(
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

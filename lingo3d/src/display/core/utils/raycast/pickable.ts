import { Point3d } from "@lincode/math"
import { Raycaster, Object3D } from "three"
import { MouseEventName, mouseEvents } from "../../../../api/mouse"
import { getManager } from "../../../../api/utils/getManager"
import { emitSelectionTarget } from "../../../../events/onSelectionTarget"
import { FAR, M2CM } from "../../../../globals"
import { LingoMouseEvent } from "../../../../interface/IMouse"
import { getCameraRendered } from "../../../../states/useCameraRendered"
import { sceneGraphExpand } from "../../../../states/useSceneGraphExpanded"
import { getSelectionFocus } from "../../../../states/useSelectionFocus"
import { setSelectionNativeTarget } from "../../../../states/useSelectionNativeTarget"
import { pt3d0 } from "../../../utils/reusables"
import { vec2Point } from "../../../utils/vec2Point"
import VisibleMixin from "../../mixins/VisibleMixin"
import { physxPtr } from "../../PhysicsObjectManager/physx/physxPtr"
import { actorPtrManagerMap } from "../../PhysicsObjectManager/physx/pxMaps"
import {
    assignPxVec,
    assignPxVec_
} from "../../PhysicsObjectManager/physx/pxMath"

const raycaster = new Raycaster()

type RaycastResult = {
    point: Point3d
    distance: number
    normal: Point3d
    manager: VisibleMixin
}

export const raycast = (
    x: number,
    y: number,
    candidates: Set<Object3D>
): RaycastResult | undefined => {
    raycaster.setFromCamera({ x, y }, getCameraRendered())
    const intersection = raycaster.intersectObjects([...candidates])[0]

    const focusedManager = getSelectionFocus()
    if (focusedManager) {
        if (intersection) {
            emitSelectionTarget(focusedManager, true)
            setSelectionNativeTarget(intersection.object)
            sceneGraphExpand(intersection.object)
        }
        return
    }
    const pxHit = physxPtr[0].pxRaycast?.(
        assignPxVec(raycaster.ray.origin),
        assignPxVec_(raycaster.ray.direction),
        FAR
    )
    if (pxHit && (!intersection || pxHit.distance < intersection.distance)) {
        const { x, y, z } = pxHit.normal
        return {
            point: vec2Point(pxHit.position),
            distance: pxHit.distance * M2CM,
            normal: new Point3d(x, y, z),
            manager: actorPtrManagerMap.get(pxHit.actor.ptr)!
        }
    }
    if (intersection)
        return {
            point: vec2Point(intersection.point),
            distance: intersection.distance * M2CM,
            normal: intersection.face?.normal ?? pt3d0,
            manager: getManager<VisibleMixin>(intersection.object)!
        }
}

type Then = (obj: VisibleMixin, e: LingoMouseEvent) => void

export default (
    name: MouseEventName | Array<MouseEventName>,
    candidates: Set<Object3D>,
    then: Then
) =>
    mouseEvents.on(name, (e) => {
        const result = raycast(e.xNorm, e.yNorm, candidates)
        if (!result) return

        const { point, distance, manager, normal } = result

        then(
            manager,
            new LingoMouseEvent(
                e.x,
                e.y,
                e.clientX,
                e.clientY,
                e.xNorm,
                e.yNorm,
                point,
                normal,
                distance,
                manager
            )
        )
    })

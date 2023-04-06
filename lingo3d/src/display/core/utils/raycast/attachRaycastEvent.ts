import { Point3d } from "@lincode/math"
import { Raycaster, Object3D } from "three"
import { getManager } from "../../../../api/utils/getManager"
import { emitSelectionTarget } from "../../../../events/onSelectionTarget"
import { FAR, M2CM } from "../../../../globals"
import { LingoMouseEvent } from "../../../../interface/IMouse"
import { sceneGraphExpand } from "../../../../states/useSceneGraphExpanded"
import { getSelectionFocus } from "../../../../states/useSelectionFocus"
import { setSelectionNativeTarget } from "../../../../states/useSelectionNativeTarget"
import { pt3d0 } from "../../../utils/reusables"
import { vec2Point } from "../../../utils/vec2Point"
import VisibleMixin from "../../mixins/VisibleMixin"
import { physxPtr } from "../../../../pointers/physxPtr"
import { assignPxVec, assignPxVec_ } from "../../../../engine/physx/pxMath"
import { actorPtrManagerMap } from "../../../../collections/pxCollections"
import { cameraRenderedPtr } from "../../../../pointers/cameraRenderedPtr"
import { onMouseDown } from "../../../../events/onMouseDown"
import computePerFrameWithData from "../../../../utils/computePerFrameWithData"

const raycaster = new Raycaster()

type RaycastResult = {
    point: Point3d
    distance: number
    normal: Point3d
    manager: VisibleMixin
}
type RaycastData = {
    x: number
    y: number
    additionalCandidate?: Object3D
}
export const raycast = computePerFrameWithData(
    (
        candidates: Set<Object3D>,
        { additionalCandidate, x, y }: RaycastData
    ): RaycastResult | undefined => {
        raycaster.setFromCamera({ x, y }, cameraRenderedPtr[0])
        const candidateArray = [...candidates]
        additionalCandidate && candidateArray.push(additionalCandidate)
        const intersection = raycaster.intersectObjects(
            candidateArray,
            false
        )[0]

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
        if (
            pxHit &&
            (!intersection || pxHit.distance < intersection.distance)
        ) {
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
)

type Then = (obj: VisibleMixin, e: LingoMouseEvent) => void

export default (
    onEvent: typeof onMouseDown,
    candidates: Set<Object3D>,
    then: Then
) =>
    onEvent((e) => {
        const result = raycast(candidates, {
            x: e.xNorm,
            y: e.yNorm
        })
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

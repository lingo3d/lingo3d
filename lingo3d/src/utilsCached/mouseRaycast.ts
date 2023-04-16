import { Point3d } from "@lincode/math"
import { Raycaster, Object3D } from "three"
import { getManager } from "../api/utils/getManager"
import { actorPtrManagerMap } from "../collections/pxCollections"
import { assignPxVec, assignPxVec_ } from "../engine/physx/pxMath"
import { FAR, M2CM } from "../globals"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import { physxPtr } from "../pointers/physxPtr"
import computePerFrameWithData from "./utils/computePerFrameWithData"
import { pt3d0, vector2 } from "../display/utils/reusables"
import { vec2Point } from "../display/utils/vec2Point"
import type VisibleMixin from "../display/core/mixins/VisibleMixin"

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
export const mouseRaycast = computePerFrameWithData(
    (
        candidates: Set<Object3D>,
        { additionalCandidate, x, y }: RaycastData
    ): RaycastResult | undefined => {
        raycaster.setFromCamera(vector2.set(x, y), cameraRenderedPtr[0])
        const candidateArray = [...candidates]
        additionalCandidate && candidateArray.push(additionalCandidate)
        const [intersection] = raycaster.intersectObjects(candidateArray, false)
        const manager = intersection && getManager(intersection.object)

        const pxHit = physxPtr[0].pxRaycast?.(
            assignPxVec(raycaster.ray.origin),
            assignPxVec_(raycaster.ray.direction),
            FAR
        )
        if (
            pxHit &&
            (!intersection ||
                pxHit.distance < intersection.distance ||
                (manager && "loaded" in manager && manager.loaded.done))
        ) {
            const { x, y, z } = pxHit.normal
            return {
                point: vec2Point(pxHit.position),
                distance: pxHit.distance * M2CM,
                normal: new Point3d(x, y, z),
                manager: actorPtrManagerMap.get(pxHit.actor.ptr)!
            }
        }
        if (intersection && manager)
            return {
                point: vec2Point(intersection.point),
                distance: intersection.distance * M2CM,
                normal: intersection.face?.normal ?? pt3d0,
                //mark
                manager: manager as any
            }
    }
)

import { selectionCandidates } from "../collections/selectionCandidates"
import MeshAppendable from "../display/core/MeshAppendable"
import { point2Vec, vec2Point } from "../display/utils/vec2Point"
import visualize from "../display/utils/visualize"
import { TransformControls } from "../engine/transformControls/TransformControls"
import getWorldPosition from "../memo/getWorldPosition"
import { raycast } from "../memo/raycast"
import { editorPlanePtr } from "../pointers/editorPlanePtr"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import { Point3dType } from "../utils/isPoint"
import createInternalSystem from "./utils/createInternalSystem"
import { Object3D } from "three"

const snapObjects: Array<Object3D> = []
for (const x of [-0.5, 0, 0.5])
    for (const y of [-0.5, 0, 0.5])
        for (const z of [-0.5, 0, 0.5]) {
            const snapObject = new Object3D()
            snapObject.position.set(x, y, z)
            snapObjects.push(snapObject)
        }

const trySnap = (self: TransformControls, direction: Point3dType) => {
    const selectionTarget = selectionTargetPtr[0] as MeshAppendable
    const result = raycast(
        selectionCandidates,
        {
            //@ts-ignore
            origin: vec2Point(self.worldPosition),
            direction: direction,
            include: self.axis === "Y" ? editorPlanePtr[0] : undefined,
            exclude: selectionTarget
        },
        true
    )
    if (!result)
        return {
            distance: Infinity,
            obj: undefined
        }
    const targetVec = point2Vec(result.point)
    const sorted = snapObjects
        .map((obj) => ({
            distance: getWorldPosition(obj).distanceTo(targetVec),
            obj
        }))
        .sort((a, b) => a.distance - b.distance)
    return sorted[0]
}

export const snapRaycastSystem = createInternalSystem("snapRaycastSystem", {
    data: {} as { direction0: Point3dType; direction1: Point3dType },
    update: (self: TransformControls, data) => {
        const snap0 = trySnap(self, data.direction0)
        const snap1 = trySnap(self, data.direction1)
        const snap = snap0.distance < snap1.distance ? snap0 : snap1
        visualize("snap", snap.obj ? vec2Point(getWorldPosition(snap.obj)) : undefined)
        console.log(snap)
    },
    effect: () => {
        const selectionTarget = selectionTargetPtr[0] as MeshAppendable
        for (const obj of snapObjects) selectionTarget.object3d.add(obj)
    },
    cleanup: () => {
        const selectionTarget = selectionTargetPtr[0] as MeshAppendable
        for (const obj of snapObjects) selectionTarget.object3d.remove(obj)
    }
})

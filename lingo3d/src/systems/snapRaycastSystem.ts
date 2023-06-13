import { selectionCandidates } from "../collections/selectionCandidates"
import { vec2Point } from "../display/utils/vec2Point"
import visualize from "../display/utils/visualize"
import { TransformControls } from "../engine/transformControls/TransformControls"
import { raycast } from "../memo/raycast"
import { editorPlanePtr } from "../pointers/editorPlanePtr"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import { Point3dType } from "../utils/isPoint"
import createInternalSystem from "./utils/createInternalSystem"

export const snapRaycastSystem = createInternalSystem("snapRaycastSystem", {
    data: {} as { direction0: Point3dType; direction1: Point3dType },
    update: (self: TransformControls, data) => {
        const result0 = raycast(
            selectionCandidates,
            {
                //@ts-ignore
                origin: vec2Point(self.worldPosition),
                direction: data.direction0,
                include: editorPlanePtr[0],
                exclude: selectionTargetPtr[0]
            },
            true
        )
        const result1 = raycast(
            selectionCandidates,
            {
                //@ts-ignore
                origin: vec2Point(self.worldPosition),
                direction: data.direction1,
                include: editorPlanePtr[0],
                exclude: selectionTargetPtr[0]
            },
            true
        )
        visualize("result0", result0?.point)
        visualize("result1", result1?.point)
    }
})
